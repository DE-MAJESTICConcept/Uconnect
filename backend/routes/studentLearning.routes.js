import express from "express";
import Style from "../models/Style.js";
import { generateLesson } from "../utils/gemini.js";

const router = express.Router();

router.post("/match-style", async (req, res) => {
  try {
    const prefs = req.body;
    const styles = await Style.find();
    let bestMatch = null;
    let bestScore = -1;

    styles.forEach((style) => {
      const score = Object.keys(prefs).reduce(
        (acc, key) => acc + (prefs[key] === style.traits[key] ? 1 : 0),
        0
      );
      if (score > bestScore) {
        bestScore = score;
        bestMatch = style;
      }
    });

    if (!bestMatch) return res.status(404).json({ error: "No style found" });
    res.json(bestMatch);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// studentLearning.routes.js

router.post("/generate-lesson", async (req, res) => {
  try {
    const { style, topic } = req.body;
    
    // Debug log to check incoming request body
    console.log("Received request to generate lesson. Style:", style);
    console.log("Received request to generate lesson. Topic:", topic);

    if (!style || !topic) {
        // Log this specific error for clarity
        console.error("Missing style or topic in request.");
        return res.status(400).json({ error: "Style and topic are required." });
    }

    const lesson = await generateLesson(style, topic);

    if (lesson.error) {
        // Log the error returned from the Gemini utility
        console.error("Error from generateLesson utility:", lesson.error);
        return res.status(500).json({ error: lesson.error });
    }

    res.json({ lesson });
  } catch (err) {
    // Log the full error stack for better diagnosis
    console.error("Lesson generation failed:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
