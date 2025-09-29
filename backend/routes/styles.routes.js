// backend/routes/styles.js
import express from "express";
import Style from "../models/Style.js";
import { analyzeStyle } from "../utils/analyzeStyle.js";

const router = express.Router();

// POST -> Analyze teacher sample and create a style
router.post("/analyze", async (req, res) => {
  try {
    const { sampleText } = req.body;
    if (!sampleText) {
      return res.status(400).json({ error: "Sample text is required" });
    }

    // Call your style analyzer
    const styleData = await analyzeStyle(sampleText);

    if (styleData.error) {
      return res.status(500).json({ error: styleData.error });
    }

    // Save to MongoDB
    const style = new Style(styleData);
    await style.save();

    res.json(style);
  } catch (err) {
    console.error("Analyze error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;