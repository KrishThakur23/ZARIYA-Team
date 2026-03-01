async function testChat() {
    try {
        const response = await fetch("http://localhost:3000/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                language: "Tamil",
                messages: [{ role: "user", content: "I am selling handmade clay pots" }]
            })
        });

        const data = await response.json();
        console.log("Status:", response.status);
        import('fs').then(fs => fs.writeFileSync('error.json', JSON.stringify(data, null, 2)));
    } catch (e) {
        console.error("Fetch error:", e);
    }
}
testChat();
