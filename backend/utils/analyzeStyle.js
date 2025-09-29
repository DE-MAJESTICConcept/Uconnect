import fetch from "node-fetch";
import dotenv from "dotenv";    

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

/**
 * Analyze a teacher's lesson sample text and return a style JSON.
 * @param {string} sampleText - The teacher's lesson text.
 * @returns {Promise<Object>} - Teaching style JSON object.
 */
export async function analyzeStyle(sampleText) {
  if (!sampleText || sampleText.trim().length === 0) {
    return { error: "Sample text is required" };
  }

  // REAL GEMINI API MODE
  if (!GEMINI_API_KEY) {
    return { error: "Missing Gemini API key." };
  }

  // --- START FEW-SHOT PROMPT REFACTOR ---

  const prompt = `
You are an expert AI Analyst specializing in educational psychology and curriculum design. 
Your sole task is to analyze the teaching pattern in the provided lesson text and extract it into a JSON object.

YOU MUST ADHERE TO THE FOLLOWING FEW-SHOT EXAMPLE AND STRUCTURE EXACTLY. Do not add any extra commentary or markdown formatting outside of the required JSON.

### START EXAMPLE ###

<LESSON_INPUT>
"Alright team, let's talk about the water cycle. You all remember that big word 'condensation' right? That’s when the clouds form! Great memory! Okay, the first phase is Evaporation, which is like water taking an invisible steam bath. Then comes Condensation (the clouds). Next, Precipitation (rain, snow). Finally, Collection (it all runs back into the ocean). So, what did you just learn are the four steps?"
</LESSON_INPUT>

<STYLE_OUTPUT>
{
  "id": "steam-bath-recall",
  "name": "Simplified Analogy & Recall Check",
  "tone": "casual and encouraging",
  "traits": {
    "prefers_examples": true,
    "tone_casual": true,
    "likes_checks": true,
    "detail_step_by_step": true,
    "pacing_short_bursts": true
  },
  "structure": [
    "Initial check for prior knowledge (condensation).",
    "Affirmation on successful recall.",
    "Introduce steps using a simplified, relatable analogy (steam bath).",
    "List and define sequential steps clearly.",
    "Formative Assessment: End with an open-ended recall question."
  ],
  "phrasing_patterns": {
    "affirmation": ["Alright team", "Great memory!", "You all remember...right?"],
    "transition": ["Okay, the first phase is...", "Then comes...", "Next, Precipitation...", "Finally, Collection..."]
  }
}
</STYLE_OUTPUT>

### END EXAMPLE ###

Analyze the lesson in the block below and provide the corresponding JSON structure.

<LESSON_INPUT>
"""
${sampleText}
"""
</LESSON_INPUT>

<STYLE_OUTPUT>
`;
  // --- END FEW-SHOT PROMPT REFACTOR ---


  try {
    const res = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });

    const data = await res.json();
    console.log("Raw API response:", data);

    if (data.candidates?.length > 0) {
      let rawText = data.candidates[0].content.parts[0].text;
      // Remove leading/trailing JSON markers the model might still produce
      rawText = rawText.replace(/```json|```/g, "").trim();

      try {
        const style = JSON.parse(rawText);
        // Ensure ID is unique and set from a real API response
        style.id = style.id || style.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        return style;
      } catch (e) {
        console.error("JSON parsing error:", e.message);
        return {
          error: `Failed to parse JSON response: ${e.message}. Raw text: ${rawText}`,
        };
      }
    } else if (data.error) {
      console.error("Gemini API error:", data.error);
      return { error: data.error.message };
    } else {
      // Added better logging for empty responses
      const errorReason = data.promptFeedback?.blockReason || "Gemini API returned an empty response with no clear error.";
      console.error(errorReason);
      return { error: errorReason };
    }
  } catch (err) {
    console.error("Network or fetch error:", err.message);
    return { error: `Failed to connect to Gemini API. Error: ${err.message}` };
  }
}
