const testSupportFlow = async () => {
    const API_URL = "http://localhost:5000/api/v1";

    try {
        console.log("1. Testing Contact Form (Ticket Creation)...");
        const contactRes = await fetch(`${API_URL}/contact`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Test User",
                email: "test@example.com",
                subject: "Test Ticket via Contact",
                message: "This is a test message to verify ticket creation.",
            }),
        });
        const contactData = await contactRes.json();
        console.log("Contact form submitted:", contactData.success);
        if (!contactData.success) console.log("Contact Error:", contactData);

        console.log("\n2. Registering Agent User...");
        const email = `agent_${Date.now()}@example.com`;
        const password = "password123";
        const registerRes = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Test Agent",
                email,
                password,
            }),
        });
        const registerData = await registerRes.json();
        const token = registerData.token;
        console.log("Agent registered. Token obtained.");

        console.log("\n3. Creating Ticket via API (Authenticated)...");
        const ticketRes = await fetch(`${API_URL}/support/tickets`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                subject: "Authenticated Ticket",
                description: "This ticket is created by a logged in user.",
                priority: "high",
                source: "web",
            }),
        });
        const ticketData = await ticketRes.json();
        console.log("Ticket created:", ticketData.success);
        if (!ticketData.success) console.log("Ticket Error:", ticketData);
        const ticketId = ticketData.data?._id;

        console.log("\n4. Adding Comment...");
        const commentRes = await fetch(
            `${API_URL}/support/tickets/${ticketId}/comments`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    content: "This is a follow-up comment.",
                }),
            }
        );
        const commentData = await commentRes.json();
        console.log("Comment added:", commentData.success);

        console.log("\n5. Fetching Ticket Details...");
        const getTicketRes = await fetch(
            `${API_URL}/support/tickets/${ticketId}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        const getTicketData = await getTicketRes.json();
        console.log("Ticket details fetched:", getTicketData.success);
        console.log("Ticket Status:", getTicketData.data.status);

        console.log("\nTest Flow Completed Successfully!");
    } catch (error) {
        console.error("Test Failed:", error);
    }
};

testSupportFlow();
