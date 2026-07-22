const { generateOpenRouterCompletion } = require("./openrouter");

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
                        "To waste time",
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
        if (!context || context.length === 0) {
            return {
                text: "I couldn't find specific information about that in the course materials. You might want to ask the instructor directly.",
                citations: []
            };
        }

        const contextText = context.map(c => `Title: ${c.title}\nContent: ${c.text}`).join("\n\n");

        const prompt = `
        You are a helpful and friendly AI teaching assistant for NovaEdge Academy.
        Your goal is to answer the student's question based on the provided course context using OpenRouter AI.
        
        IMPORTANT: 
        1. Explain the answer in simple, human language (ELI5 style).
        2. Use Markdown formatting (bold, lists, code blocks) to make the answer easy to read.
        3. Be concise and encouraging.

        Context:
        ${contextText}

        Student Question: ${query}

        Answer:
        `;

        const text = await generateOpenRouterCompletion(prompt);

        return {
            text: text || "I'm sorry, I couldn't generate an answer right now.",
            citations: context.filter(c => c.lectureId).map(c => ({
                lectureId: c.lectureId,
                title: c.title
            }))
        };
    } catch (error) {
        console.error("OpenRouter Chat Error:", error.message);
        return {
            text: "I'm sorry, I'm having trouble thinking right now. Please check OPENROUTER_API_KEY configuration.",
            citations: []
        };
    }
};
