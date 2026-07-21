const Course = require("../models/Course");
const LectureVersion = require("../models/LectureVersion");
const NotificationService = require("../utils/notificationService");

// 1. Create Version (Update Lecture & Save Snapshot)
exports.createLectureVersion = async (req, res) => {
    try {
        const { courseId, lectureId } = req.params;
        const { title, description, videoUrl, changelog, updateType = "minor" } = req.body;

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ success: false, message: "Course not found" });

        const lecture = course.lectures.id(lectureId);
        if (!lecture) return res.status(404).json({ success: false, message: "Lecture not found" });

        // Calculate new version
        const newVersion = (lecture.currentVersion || 1) + 1;

        // Update Lecture Data
        if (title) lecture.title = title;
        if (description) lecture.description = description;
        if (videoUrl) {
            lecture.video.url = videoUrl;
            lecture.video.public_id = "youtube"; // Assuming YouTube for now or handled by frontend upload
        }
        lecture.currentVersion = newVersion;

        await course.save();

        // Save Version Snapshot
        await LectureVersion.create({
            courseId,
            lectureId,
            version: newVersion,
            data: {
                title: lecture.title,
                description: lecture.description,
                video: lecture.video,
                duration: lecture.duration,
                notes: lecture.notes,
            },
            changelog: changelog || "Updated lecture content",
            updateType,
            updatedBy: req.user.id,
        });

        // Notify Users (if Major)
        if (updateType === "major") {
            // Ideally fetch enrolled users and notify
            // For now, just a placeholder or broadcast
            // await NotificationService.broadcast(enrolledUserIds, { ... });
        }

        res.status(200).json({ success: true, message: "Lecture updated and version saved", version: newVersion });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Get Versions
exports.getLectureVersions = async (req, res) => {
    try {
        const { courseId, lectureId } = req.params;
        const versions = await LectureVersion.find({ courseId, lectureId })
            .sort({ version: -1 })
            .populate("updatedBy", "name");

        res.status(200).json({ success: true, versions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Rollback Version
exports.rollbackLectureVersion = async (req, res) => {
    try {
        const { versionId } = req.params;
        const targetVersion = await LectureVersion.findById(versionId);
        if (!targetVersion) return res.status(404).json({ success: false, message: "Version not found" });

        const course = await Course.findById(targetVersion.courseId);
        if (!course) return res.status(404).json({ success: false, message: "Course not found" });

        const lecture = course.lectures.id(targetVersion.lectureId);
        if (!lecture) return res.status(404).json({ success: false, message: "Lecture not found" });

        // Create a NEW version for the rollback (Append-only history)
        const newVersionNum = (lecture.currentVersion || 1) + 1;

        // Restore Data
        lecture.title = targetVersion.data.title;
        lecture.description = targetVersion.data.description;
        lecture.video = targetVersion.data.video;
        lecture.duration = targetVersion.data.duration;
        lecture.notes = targetVersion.data.notes;
        lecture.currentVersion = newVersionNum;

        await course.save();

        // Save Rollback Snapshot
        await LectureVersion.create({
            courseId: course._id,
            lectureId: lecture._id,
            version: newVersionNum,
            data: targetVersion.data,
            changelog: `Rollback to v${targetVersion.version} by ${req.user.name}`,
            updateType: "rollback",
            updatedBy: req.user.id,
        });

        res.status(200).json({ success: true, message: "Rolled back successfully", version: newVersionNum });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
