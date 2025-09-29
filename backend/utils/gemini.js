/**
 * This file contains the function for generating a lesson using the Gemini API.
 * It is a refactored part of the original client, dedicated to content generation.
 */
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// In both analyzeStyle.js and gemini.js

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
/**
 * Generate a lesson based on student style and topic.
 * @param {Object} style - The matched learning style object.
 * @param {string} topic - The topic the student wants to learn.
 * @returns {Promise<string>} The generated lesson text.
 */
// gemini.js

export async function generateLesson(style, topic) {
  // ... (existing code for setting up traits and prompt)
  const traits = Object.keys(style.traits || {}).filter(key => style.traits[key]).join(', ');
  const structure = (style.structure || []).join(', ');
  const tone = style.tone || 'neutral';
  
  // NOTE: A more complex prompt would be constructed here using the style object
  const prompt = `
    Generate a lesson on the topic of "${topic}".
    Adopt a teaching style with the following characteristics:
    Tone: ${tone}
    Key Traits: ${traits}
    Lesson Flow/Structure: ${structure}
    Use phrasing patterns similar to: ${JSON.stringify(style.phrasing_patterns)}
  `;

  try {
    const res = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await res.json();

    // This is the new debug line. It will show the full API response.
    console.log("Raw Gemini API response:", JSON.stringify(data, null, 2));

    if (data.candidates?.length > 0) {
      return data.candidates[0].content.parts[0].text;
    } else {
      const errorReason = data.promptFeedback?.blockReason || data.error?.message || "Unknown error from Gemini API";
      console.error("Gemini API request failed:", errorReason);
      return { error: `API request failed: ${errorReason}` };
    }
  } catch (err) {
    console.error("Gemini API call error:", err);
    return { error: "Failed to connect to Gemini API." };
  }
}
