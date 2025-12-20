const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async function (context) {
    // 1. Initialize Gemini with your secret key from Environment Variables
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    try {
        // 2. Parse the question sent from your Profile.jsx
        const payload = JSON.parse(context.req.body);
        const userQuestion = payload.question;

        // 3. Set the context for the AI
        const prompt = `You are the support assistant for the Memora flashcard app, created by Lj Geposon. 
        Answer this user question helpfully: ${userQuestion}`;

        // 4. Generate the response
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // 5. Return the answer to the mobile app
        return context.res.json({ answer: text });

    } catch (err) {
        context.error("AI Error: " + err.message);
        return context.res.json({ error: "I'm having trouble connecting to Gemini." }, 500);
    }
};