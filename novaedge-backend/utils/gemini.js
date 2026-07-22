const { generateOpenRouterCompletion } = require("./openrouter");

/**
 * Universal AI Completion Wrapper using OpenRouter by default,
 * with automatic fallback to Google Gemini and polite assistant response if credits/quota are limited.
 */
module.exports = {
  generateContent: async (prompt) => {
    const promptText = typeof prompt === "string" 
      ? prompt 
      : (prompt.contents?.[0]?.parts?.[0]?.text || JSON.stringify(prompt));

    let text = "";

    // 1. Try OpenRouter first if OPENROUTER_API_KEY is provided
    if (process.env.OPENROUTER_API_KEY) {
      try {
        text = await generateOpenRouterCompletion(promptText);
      } catch (openRouterErr) {
        console.warn("OpenRouter API error (falling back to Gemini):", openRouterErr.message);
        
        // Automatic fallback to Gemini if key available
        if (process.env.GEMINI_API_KEY) {
          try {
            const { GoogleGenerativeAI } = require("@google/generative-ai");
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
            const result = await model.generateContent(promptText);
            const response = await result.response;
            text = response.text();
          } catch (geminiErr) {
            console.warn("Gemini API rate limit (using assistant fallback):", geminiErr.message);
            text = "Welcome to NovaEdge Academy! I am your AI learning assistant. Ask me anything about our courses and projects!";
          }
        } else {
          text = "Welcome to NovaEdge Academy! I am your AI learning assistant. Ask me anything about our courses and projects!";
        }
      }
    } else if (process.env.GEMINI_API_KEY) {
      // 2. Direct Gemini fallback
      try {
        const { GoogleGenerativeAI } = require("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(promptText);
        const response = await result.response;
        text = response.text();
      } catch (err) {
        text = "Welcome to NovaEdge Academy! I am your AI learning assistant. Ask me anything about our courses and projects!";
      }
    } else {
      text = "Welcome to NovaEdge Academy! I am your AI learning assistant. Ask me anything about our courses and projects!";
    }

    return {
      response: {
        text: () => text,
      },
    };
  },
};
