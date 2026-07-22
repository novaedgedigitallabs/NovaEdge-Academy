const Mentor = require("../models/Mentor");
const MentorshipBooking = require("../models/MentorshipBooking");

const DEFAULT_MENTORS = [
    {
        name: "Sarah Johnson",
        role: "Senior Frontend Engineer",
        company: "Google",
        bio: "Passionate about React, accessibility, and performance. I love helping beginners bridge the gap between basics and production code.",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
        skills: ["React", "Next.js", "TypeScript"],
        socialLinks: { linkedin: "https://linkedin.com", twitter: "https://x.com", github: "https://github.com" },
    },
    {
        name: "David Chen",
        role: "Staff Software Engineer",
        company: "Netflix",
        bio: "Backend specialist with 10+ years of experience in distributed systems and microservices. Ask me anything about scalable Node.js architecture.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
        skills: ["Node.js", "System Design", "AWS"],
        socialLinks: { linkedin: "https://linkedin.com", github: "https://github.com" },
    },
    {
        name: "Emily Rodriguez",
        role: "Product Designer",
        company: "Airbnb",
        bio: "Design systems enthusiast. I mentor designers on how to create intuitive and beautiful user interfaces that convert.",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
        skills: ["UI/UX", "Figma", "Design Systems"],
        socialLinks: { linkedin: "https://linkedin.com", twitter: "https://x.com" },
    },
    {
        name: "Michael Chang",
        role: "Machine Learning Engineer",
        company: "OpenAI",
        bio: "Working on large language models. Happy to guide you through the math, code, and career paths in AI.",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
        skills: ["Python", "PyTorch", "NLP"],
        socialLinks: { linkedin: "https://linkedin.com", github: "https://github.com" },
    },
    {
        name: "Jessica Williams",
        role: "DevOps Engineer",
        company: "Spotify",
        bio: "Automating everything. I can help you master CI/CD pipelines, Kubernetes, and cloud infrastructure.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
        skills: ["Kubernetes", "Docker", "AWS"],
        socialLinks: { linkedin: "https://linkedin.com", twitter: "https://x.com" },
    },
    {
        name: "James Wilson",
        role: "Engineering Manager",
        company: "Microsoft",
        bio: "Focusing on career growth, leadership, and soft skills for software engineers looking to level up.",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
        skills: ["Leadership", "Career Growth", "Agile"],
        socialLinks: { linkedin: "https://linkedin.com", twitter: "https://x.com" },
    },
];

// 1. Get All Mentors (Auto-seed if empty)
exports.getAllMentors = async (req, res) => {
    try {
        let mentors = await Mentor.find({ isActive: true }).sort({ createdAt: -1 });

        if (!mentors || mentors.length === 0) {
            console.log("No mentors found in DB. Auto-seeding default mentors...");
            mentors = await Mentor.insertMany(DEFAULT_MENTORS);
        }

        res.status(200).json({
            success: true,
            data: mentors,
            count: mentors.length,
        });
    } catch (error) {
        console.error("getAllMentors error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Get Single Mentor
exports.getMentor = async (req, res) => {
    try {
        const mentor = await Mentor.findById(req.params.id);
        if (!mentor) {
            return res.status(404).json({ success: false, message: "Mentor not found" });
        }
        res.status(200).json({ success: true, data: mentor });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Create Mentor (Admin)
exports.createMentor = async (req, res) => {
    try {
        const mentor = await Mentor.create(req.body);
        res.status(201).json({ success: true, data: mentor });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// 4. Update Mentor (Admin)
exports.updateMentor = async (req, res) => {
    try {
        const mentor = await Mentor.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!mentor) {
            return res.status(404).json({ success: false, message: "Mentor not found" });
        }
        res.status(200).json({ success: true, data: mentor });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// 5. Delete Mentor (Admin)
exports.deleteMentor = async (req, res) => {
    try {
        const mentor = await Mentor.findByIdAndDelete(req.params.id);
        if (!mentor) {
            return res.status(404).json({ success: false, message: "Mentor not found" });
        }
        res.status(200).json({ success: true, message: "Mentor deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 6. Book Mentorship Session
exports.bookSession = async (req, res) => {
    try {
        const { mentorId, date, timeSlot, topic } = req.body;

        if (!mentorId || !date || !timeSlot) {
            return res.status(400).json({
                success: false,
                message: "Mentor, Date, and Time slot are required.",
            });
        }

        const mentor = await Mentor.findById(mentorId);
        const mentorName = mentor ? mentor.name : "Mentor";

        const booking = await MentorshipBooking.create({
            user: req.user.id,
            mentor: mentorId,
            mentorName: mentorName,
            date: date,
            timeSlot: timeSlot,
            topic: topic || "1-on-1 Mentorship Guidance",
        });

        res.status(201).json({
            success: true,
            message: `Session booked with ${mentorName} for ${date} at ${timeSlot}`,
            booking,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
