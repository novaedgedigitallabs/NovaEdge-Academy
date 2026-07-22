const { generateOpenRouterCompletion } = require("./openrouter");

/**
 * Universal AI Completion Wrapper using OpenRouter by default.
 * Provides backwards compatibility for generateContent(prompt).
 */
module.exports = {
  generateContent: async (prompt) => {
    const promptText = typeof prompt === "string" 
      ? prompt 
      : (prompt.contents?.[0]?.parts?.[0]?.text || JSON.stringify(prompt));

    let text = "";

    // Always prefer OpenRouter if OPENROUTER_API_KEY is configured
    if (process.env.OPENROUTER_API_KEY) {
      text = await generateOpenRouterCompletion(promptText);
    } else {
      // Try OpenRouter first, fall back to Google Gemini if configured
      try {
        text = await generateOpenRouterCompletion(promptText);
      } catch (openRouterError) {
        if (process.env.GEMINI_API_KEY) {
          try {
            const { GoogleGenerativeAI } = require("@google/generative-ai");
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
            const result = await model.generateContent(promptText);
            const response = await result.response;
            text = response.text();
          } catch (geminiError) {
            console.error("Gemini Fallback Error:", geminiError.message);
            throw openRouterError;
          }
        } else {
          throw openRouterError;
        }
      }
    }

    return {
      response: {
        text: () => text,
      },
    };
  },
};
