const OpenAI = require("openai");

module.exports = async function (context) {
    // Access the key securely from Appwrite environment variables
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY, 
    });

    try {
        const payload = JSON.parse(context.req.body);
        const userQuestion = payload.question;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant for Memora." },
                { role: "user", content: userQuestion }
            ],
        });

        return context.res.json({ answer: response.choices[0].message.content });
    } catch (err) {
        context.error("Error: " + err.message);
        return context.res.json({ error: "Service unavailable" }, 500);
    }
};
