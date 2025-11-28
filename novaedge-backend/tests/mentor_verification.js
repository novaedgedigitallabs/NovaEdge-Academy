const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load env vars
dotenv.config({ path: path.join(__dirname, "../.env") });

const User = require("../models/User");
const Course = require("../models/Course");
const Assignment = require("../models/Assignment");

// We need to use fetch, assuming Node 18+
// If not, we might fail. Let's check node version or just try.

const BASE_URL = "http://localhost:5000/api/v1";

async function runTest() {
    try {
        console.log("Connecting to DB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected.");

        // 1. Create Mentor User
        const mentorEmail = `mentor_${Date.now()}@test.com`;
        const mentorPassword = "password123";

        console.log(`Creating Mentor: ${mentorEmail}`);
        let mentor = await User.create({
            name: "Test Mentor",
            email: mentorEmail,
            password: mentorPassword,
            avatar: { public_id: "test", url: "test" },
            role: "mentor",
        });

        // 2. Create Course
        console.log("Creating Course...");
        let course = await Course.create({
            title: `Mentor Test Course ${Date.now()}`,
            description: "Testing mentor capabilities",
            category: "Software Development",
            createdBy: "Admin",
            price: 100,
            poster: { public_id: "test", url: "test" },
            mentors: [mentor._id], // Assign mentor
        });

        // 3. Login as Mentor to get Token
        console.log("Logging in as Mentor...");
        const loginRes = await fetch(`${BASE_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: mentorEmail, password: mentorPassword }),
        });

        if (!loginRes.ok) {
            throw new Error(`Login failed: ${loginRes.status} ${await loginRes.text()}`);
        }

        // Extract cookie
        const cookie = loginRes.headers.get("set-cookie");
        if (!cookie) throw new Error("No cookie received");

        // We need to parse the token from the cookie if we were using a library, 
        // but fetch handles cookies automatically? No, node-fetch doesn't.
        // We need to send the cookie in subsequent requests.
        // The cookie string might contain multiple cookies, we just pass it along.

        const headers = {
            "Content-Type": "application/json",
            "Cookie": cookie,
        };

        // 4. Test: Get Mentor Profile
        console.log("Testing: Get Mentor Profile");
        const profileRes = await fetch(`${BASE_URL}/mentor/me`, { headers });
        const profileData = await profileRes.json();

        if (!profileData.success) {
            console.log("Profile Data:", profileData);
            throw new Error("Get Profile failed");
        }
        if (profileData.assignedCourses.length === 0) throw new Error("No assigned courses found");
        console.log("PASS: Mentor Profile loaded");

        // 5. Test: Upload Lecture
        console.log("Testing: Upload Lecture");
        const lectureRes = await fetch(`${BASE_URL}/mentor/course/${course._id}/lecture`, {
            method: "POST",
            headers,
            body: JSON.stringify({
                title: "Test Lecture",
                description: "This is a test lecture",
                videoUrl: "https://youtube.com/watch?v=123",
                duration: 10
            }),
        });
        const lectureData = await lectureRes.json();
        if (!lectureData.success) throw new Error(`Upload Lecture failed: ${lectureData.message}`);
        console.log("PASS: Lecture Uploaded");

        // 6. Test: Create Assignment
        console.log("Testing: Create Assignment");
        const assignmentRes = await fetch(`${BASE_URL}/mentor/course/${course._id}/assignment`, {
            method: "POST",
            headers,
            body: JSON.stringify({
                title: "Test Assignment",
                description: "Do this",
                maxMarks: 50
            }),
        });
        const assignmentData = await assignmentRes.json();
        if (!assignmentData.success) throw new Error(`Create Assignment failed: ${assignmentData.message}`);
        console.log("PASS: Assignment Created");

        // Cleanup
        console.log("Cleaning up...");
        await User.findByIdAndDelete(mentor._id);
        await Course.findByIdAndDelete(course._id);
        await Assignment.deleteMany({ course: course._id });

        console.log("ALL TESTS PASSED");
        process.exit(0);

    } catch (error) {
        console.error("TEST FAILED:", error);
        process.exit(1);
    }
}

runTest();
