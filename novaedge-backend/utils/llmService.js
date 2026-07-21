// This is a MOCK LLM Service.
// In production, replace this with calls to OpenAI, Anthropic, or a local LLM.

exports.generateLectureContent = async (lectureTitle, lectureDescription) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Return structured JSON
    return {
        summary: `This lecture covers the core concepts of ${lectureTitle}. We explore ${lectureDescription || "the fundamental principles"}, discussing real-world applications and best practices. By the end, you will have a solid understanding of how to apply these skills in your projects.`,
        keyPoints: [
            `Understanding the basics of ${lectureTitle}`,
            "Key terminology and definitions",
            "Common pitfalls and how to avoid them",
            "Best practices for implementation",
            "Future trends and advanced topics",
        ],
        mcqs: [
            {
                question: `What is the primary focus of ${lectureTitle}?`,
                options: [
                    "To confuse beginners",
                    `To master ${lectureTitle} concepts`,
                    "To waste time",
                    "None of the above",
                ],
                correctAnswer: `To master ${lectureTitle} concepts`,
                explanation: "The lecture is designed to provide comprehensive knowledge on the subject.",
            },
            {
                question: "Which of the following is a key benefit discussed?",
                options: [
                    "Increased complexity",
                    "Reduced performance",
                    "Improved efficiency",
                    "Higher costs",
                ],
                correctAnswer: "Improved efficiency",
                explanation: "Efficiency is a major advantage of applying these principles correctly.",
            },
            {
                question: "What should you avoid when implementing this?",
                options: [
                    "Following best practices",
                    "Ignoring documentation",
                    "Testing your code",
                    "Asking for help",
                ],
                correctAnswer: "Ignoring documentation",
                explanation: "Documentation provides essential guidance and should not be overlooked.",
            },
        ],
    };
};

const geminiModel = require("./gemini");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// ... (generateLectureContent remains mock or can be updated later)

exports.generateChatResponse = async (query, context) => {
    try {
        if (!context || context.length === 0) {
            return {
                text: "I couldn't find specific information about that in the course materials. You might want to ask the instructor directly.",
                citations: []
            };
        }

        const contextText = context.map(c => `Title: ${c.title}\nContent: ${c.text}`).join("\n\n");

        const prompt = `
        You are a helpful and friendly AI teaching assistant for a course.
        Your goal is to answer the student's question based on the provided course context.
        
        IMPORTANT: 
        1. Explain the answer in simple, human language (ELI5 style). Avoid complex jargon unless necessary, and if you use it, explain it simply.
        2. Use Markdown formatting (bold, lists, code blocks) to make the answer easy to read.
        3. Be concise and encouraging.

        Context:
        ${contextText}

        Student Question: ${query}

        Answer:
        `;

        const result = await geminiModel.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return {
            text: text,
            citations: context.filter(c => c.lectureId).map(c => ({
                lectureId: c.lectureId,
                title: c.title
            }))
        };
    } catch (error) {
        console.error("Gemini Chat Error:", error);
        return {
            text: "I'm sorry, I'm having trouble thinking right now. Please try again later.",
            citations: []
        };
    }
};
