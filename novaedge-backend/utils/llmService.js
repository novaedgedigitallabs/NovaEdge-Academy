const { generateOpenRouterCompletion } = require("./openrouter");
const { generateContent } = require("./gemini");

exports.generateLectureContent = async (lectureTitle, lectureDescription) => {
    const prompt = `
    You are an expert curriculum author for NovaEdge Academy.
    Create structured educational resources for a lecture titled "${lectureTitle}".
    Description: "${lectureDescription || "Comprehensive guide and hands-on practice."}"

    Return strictly valid JSON format without markdown code blocks with structure:
    {
      "summary": "Concise summary of lecture (150 words)...",
      "keyPoints": ["Key point 1", "Key point 2", "Key point 3", "Key point 4", "Key point 5"],
      "mcqs": [
        {
          "question": "Question text...",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": "Option B",
          "explanation": "Explanation text..."
        }
      ]
    }
    `;

    try {
        const text = await generateOpenRouterCompletion(prompt);
        const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(cleanedText);
    } catch (err) {
        console.error("OpenRouter Lecture Generation Error:", err.message);
        return {
            summary: `This lecture covers core concepts of ${lectureTitle}. We explore ${lectureDescription || "fundamental principles"}, discussing real-world applications and best practices.`,
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
                        "To master fundamental skills",
                        "None of the above",
                    ],
                    correctAnswer: `To master ${lectureTitle} concepts`,
                    explanation: "The lecture is designed to provide comprehensive knowledge on the subject.",
                },
            ],
        };
    }
};

exports.generateChatResponse = async (query, context) => {
    try {
        const contextText = (context && context.length > 0) 
            ? context.map(c => `Title: ${c.title}\nContent: ${c.text}`).join("\n\n")
            : "General assistant context for NovaEdge Academy student.";

        const prompt = `
        You are a helpful, smart, and friendly AI learning assistant for NovaEdge Academy.
        Your goal is to answer the student's message clearly, concisely, and encouragingly.
        Use clean Markdown formatting.

        Context:
        ${contextText}

        Student Message: ${query}

        Answer:
        `;

        let text = "";
        try {
            text = await generateOpenRouterCompletion(prompt);
        } catch (openRouterErr) {
            console.warn("OpenRouter Chat error, using Gemini fallback:", openRouterErr.message);
            try {
                const geminiRes = await generateContent(prompt);
                text = geminiRes.response.text();
            } catch (geminiErr) {
                console.warn("Gemini error:", geminiErr.message);
            }
        }

        if (!text || !text.trim()) {
            text = `Hello! I am **NovaEdge AI**, your learning assistant. I am happy to help you with "${query}". How can I assist you further today?`;
        }

        return {
            text,
            citations: (context || []).filter(c => c.lectureId).map(c => ({
                lectureId: c.lectureId,
                title: c.title
            }))
        };
    } catch (error) {
        console.error("AI Chat Error:", error.message);
        return {
            text: `Hello! I am **NovaEdge AI**. I received your message: "${query}". I am here to help you with all your courses, learning, and projects at NovaEdge Academy!`,
            citations: []
        };
    }
};
