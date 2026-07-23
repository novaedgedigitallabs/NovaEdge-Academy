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

function stripEmojis(str) {
    if (!str) return "";
    return str.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
}

exports.generateChatResponse = async (query, context) => {
    try {
        const contextText = (context && context.length > 0) 
            ? context.map(c => `Title: ${c.title}\nContent: ${c.text}`).join("\n\n")
            : "General assistant context for NovaEdge Academy student.";

        const prompt = `
You are NovaEdge AI, a highly experienced, friendly, and direct human-like mentor at NovaEdge Academy.

STRICT INSTRUCTIONS FOR YOUR RESPONSE:
1. ABSOLUTELY NO EMOJIS: Do not include any emojis or emoji icons anywhere in your response.
2. NO GENERIC OR ROBOTIC AI BUZZWORDS: Avoid cliché AI phrases and buzzwords such as "delve", "tapestry", "testament", "realm", "moreover", "furthermore", "leverage", "robust", "in conclusion", "supercharge", "beacon", "dive deep", "game changer", "unlock your potential".
3. HUMANIZE YOUR TONE: Write in a simple, direct, conversational human tone as if an experienced software engineer and mentor is explaining the topic directly to a developer or student.
4. FORMATTING:
   - Use clean, well-spaced Markdown (### Headings, clear bullet points).
   - For any code snippets, ALWAYS use fenced code blocks with language identifiers (e.g. \`\`\`python).

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
            text = `Hello! I am NovaEdge AI, your learning mentor. How can I help you with your question about "${query}"?`;
        }

        // Post-process to ensure no emojis
        text = stripEmojis(text);

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
            text: `Hello! I am NovaEdge AI. I received your message: "${query}". How can I assist you with your learning today?`,
            citations: []
        };
    }
};
