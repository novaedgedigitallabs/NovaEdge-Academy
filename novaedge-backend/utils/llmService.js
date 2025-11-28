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

exports.generateChatResponse = async (query, context) => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate latency

    if (!context || context.length === 0) {
        return {
            text: "I couldn't find specific information about that in the course materials. You might want to ask the instructor directly.",
            citations: []
        };
    }

    // Mock response based on context
    const mainContext = context[0];
    return {
        text: `Based on the lecture "${mainContext.title}", ${query.includes("what") ? "this concept refers to" : "the key idea is"} ${mainContext.summary.substring(0, 50)}... The lecture explains that ${mainContext.keyPoints[0]}.`,
        citations: context.map(c => ({
            lectureId: c.lectureId,
            title: c.title
        }))
    };
};
