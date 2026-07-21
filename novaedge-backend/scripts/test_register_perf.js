const testRegisterPerf = async () => {
    const API_URL = "http://localhost:5000/api/v1";
    console.log("Starting registration performance test...");

    const email = `perf_${Date.now()}@example.com`;
    const password = "password123";
    const name = "Perf Test";
    const username = `perf_${Date.now()}`;

    const startTime = Date.now();

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password, username })
        });

        const duration = Date.now() - startTime;
        console.log(`Response Status: ${response.status}`);
        console.log(`Total time taken: ${duration}ms`);

        const data = await response.json();
        console.log("Response Body:", JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Request failed:", error);
    }
};

testRegisterPerf();
