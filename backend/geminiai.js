require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize with your API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Map explanation modes to specific prompts
const getPromptForMode = (mode, code, language = "javascript") => {
  const prompts = {
    explain: `Explain this ${language} code in plain English. Focus on what it does and why:\n\n${code}`,

    "line-by-line": `Explain this ${language} code line by line. Break down what each line does:\n\n${code}`,

    complexity: `Analyze the time complexity (Big O) and space complexity of this ${language} code. Also suggest any optimizations:\n\n${code}`,

    bugs: `Review this ${language} code for potential bugs, edge cases, and security issues. List any problems found:\n\n${code}`,
  };

  return prompts[mode] || prompts.explain;
};

// Model ID
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// (code, (language = "javascript"));
async function explainCode(
  code,
  mode = "explain",
  language = "javascript",
  retries = 5,
  delay = 1000,
) {
  // Validate inputs
  if (!code || typeof code !== "string") {
    throw new Error("Code is required and must be a string");
  }

  if (!code.trim()) {
    throw new Error("Code cannot be empty");
  }

  // Get the appropriate prompt based on mode
  const prompt = getPromptForMode(mode, code, language);

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    const response = await result.response;
    console.log(response);
    return {
      explanation: response.text(),
    };
  } catch (error) {
    // Handle rate limits or temporary server errors with exponential backoff
    const status = error.status || error.code;
    const isRateLimit = status === 429 || error.message?.includes("429");
    const isServerError = status >= 500 || error.message?.includes("500");

    // Handle rate limits or temporary server errors with exponential backoff
    if (retries > 0 && (isRateLimit || isServerError)) {
      console.log(
        `⚠️ Request failed. Retrying in ${delay}ms... (${retries} retries left)`,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      return explainCode(code, mode, language, retries - 1, delay * 2);
    }

    console.error("❌ Gemini Error:", error.message);
    throw error;
  }
}

module.exports = explainCode;
