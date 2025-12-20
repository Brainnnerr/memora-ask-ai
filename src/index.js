const OpenAI = require("openai");

module.exports = async function (context) {
    const openai = new OpenAI({
        apiKey: process.env.GROQ_API_KEY, 
        baseURL: "https://api.groq.com/openai/v1" 
    });

    try {
        const payload = JSON.parse(context.req.body);
        const response = await openai.chat.completions.create({
            model: "llama-3.3-70b-versatile", 
            messages: [
                { role: "system", content: "You are the support assistant for Memora." },
                { role: "user", content: payload.question }
            ],
        });

        return context.res.json({ answer: response.choices[0].message.content });

    } catch (err) {
        // Check if the error is a Rate Limit (429)
        if (err.status === 429 || err.message.includes("429")) {
            return context.res.json({ 
                error: "rate_limit", 
                message: "AI limit reached. Please wait about a minute for tokens to reset." 
            }, 429); // Return a 429 status code
        }

        context.error("Groq Error: " + err.message);
        return context.res.json({ error: "error", message: "AI service temporarily unavailable." }, 500);
    }
};
