const OpenAI = require("openai");

module.exports = async function (context) {
    // 1. Initialize with Groq's URL and your Groq API Key
    const openai = new OpenAI({
        apiKey: process.env.GROQ_API_KEY, 
        baseURL: "https://api.groq.com/openai/v1" 
    });

    try {
        // 2. Parse the question sent from your app
        const payload = JSON.parse(context.req.body);
        const userQuestion = payload.question;

        // 3. Generate response using Llama 3.3 on Groq
        const response = await openai.chat.completions.create({
            model: "llama-3.3-70b-versatile", 
            messages: [
                { role: "system", content: "You are the support assistant for Memora, created by Lj Geposon. Answer briefly and helpfully." },
                { role: "user", content: userQuestion }
            ],
        });

        // 4. Return the answer
        return context.res.json({ answer: response.choices[0].message.content });

    } catch (err) {
        context.error("Groq Error: " + err.message);
        return context.res.json({ error: "AI service temporarily unavailable." }, 500);
    }
};
