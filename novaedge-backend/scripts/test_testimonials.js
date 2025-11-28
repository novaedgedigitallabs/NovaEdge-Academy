const testTestimonialFlow = async () => {
    const API_URL = "http://localhost:5000/api/v1";

    try {
        console.log("1. Registering User...");
        const email = `student_${Date.now()}@example.com`;
        const password = "password123";

        // Register
        const regRes = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: "Test Student", email, password }),
        });

        if (!regRes.ok) {
            const text = await regRes.text();
            console.log("Register Failed:", regRes.status, text);
            return;
        }

        const regData = await regRes.json();
        const token = regData.token;
        console.log("User registered:", regData.success);

        // 2. Submit Testimonial (Text only for speed, video requires multipart)
        console.log("\n2. Submitting Testimonial...");
        const formData = new FormData();
        formData.append("text", "This course was amazing!");

        // Note: Node.js fetch FormData handling is tricky without 'form-data' package.
        // We will simulate a JSON request if the controller supports it, OR we skip this step 
        // and rely on manual testing for file uploads.
        // However, our controller expects req.body.text, so JSON should work for text-only if we send it as JSON.
        // But the frontend sends FormData. Let's see if our controller handles JSON body too.
        // The controller uses `req.body` which Express parses for JSON too.

        const submitRes = await fetch(`${API_URL}/testimonials`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ text: "This course was amazing!" }),
        });
        const submitData = await submitRes.json();
        console.log("Testimonial submitted:", submitData.success);
        const testimonialId = submitData.data?._id;

        // 3. Verify it is NOT public yet
        console.log("\n3. Checking Public List (Should be empty)...");
        const publicRes = await fetch(`${API_URL}/testimonials`);
        const publicData = await publicRes.json();
        const found = publicData.data.find(t => t._id === testimonialId);
        console.log("Found in public list:", !!found);

        // 4. Admin Approve (Simulated)
        // We need an admin token. For this script we will skip this unless we register an admin.
        // But we verified the creation flow.

        console.log("\nTest Flow Completed (Partial Verification)");
        console.log("To fully verify, please manually submit a video on frontend and approve it as Admin.");

    } catch (error) {
        console.error("Test Failed:", error);
    }
};

testTestimonialFlow();
