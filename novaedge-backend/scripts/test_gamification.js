const testGamificationFlow = async () => {
    const API_URL = "http://localhost:5000/api/v1";

    try {
        console.log("1. Registering Admin User...");
        const email = `admin_game_${Date.now()}@example.com`;
        const password = "password123";

        // Register (we need admin to create badge, but we can't easily become admin via script without backdoor)
        // However, we can test the public APIs and assume we have an admin token if we were doing this manually.
        // For this script, let's try to register and see if we can access the public badge list.

        const regRes = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: "Test Gamer", email, password }),
        });
        const regData = await regRes.json();
        const token = regData.token;
        console.log("User registered:", regData.success);

        // 2. Get Badges (Public)
        console.log("\n2. Fetching Badges...");
        const badgesRes = await fetch(`${API_URL}/badges`);
        const badgesData = await badgesRes.json();
        console.log("Badges found:", badgesData.count);

        // 3. Check My Badges (Should be empty)
        console.log("\n3. Checking My Badges...");
        const myBadgesRes = await fetch(`${API_URL}/badges/me`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const myBadgesData = await myBadgesRes.json();
        console.log("My Badges count:", myBadgesData.count);

        console.log("\nTest Flow Completed (Partial Verification)");
        console.log("To fully verify: Log in as Admin -> Create Badge -> Complete Course -> Check Profile");

    } catch (error) {
        console.error("Test Failed:", error);
    }
};

testGamificationFlow();
