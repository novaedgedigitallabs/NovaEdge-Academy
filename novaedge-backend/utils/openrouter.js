const axios = require("axios");

/**
 * Generate AI completion via OpenRouter API (https://openrouter.ai)
 * Supports all OpenRouter models (e.g. deepseek/deepseek-chat, google/gemini-2.0-flash-001, meta-llama/llama-3.3-70b-instruct:free)
 */
async function generateOpenRouterCompletion(prompt, options = {}) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    console.warn("OPENROUTER_API_KEY is not set in environment. Check your .env file.");
  }

  const model = process.env.OPENROUTER_MODEL || options.model || "openrouter/auto";

  let messages = options.messages;
  if (!messages || !Array.isArray(messages)) {
    messages = [];
    if (options.system) {
      messages.push({ role: "system", content: options.system });
    }
    if (typeof prompt === "string" && prompt.trim()) {
      messages.push({ role: "user", content: prompt });
    }
  }

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model,
        messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.max_tokens ?? 2000,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey || ""}`,
          "HTTP-Referer": "https://www.novaedgeacademy.in",
          "X-Title": "NovaEdge Academy",
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    const text = response.data?.choices?.[0]?.message?.content || "";
    return text.trim();
  } catch (error) {
    console.error("OpenRouter API Error:", error?.response?.data || error.message);
    throw new Error(error?.response?.data?.error?.message || error.message || "Failed to generate AI response via OpenRouter");
  }
}

module.exports = {
  generateOpenRouterCompletion,
};
