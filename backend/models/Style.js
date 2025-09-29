import mongoose from "mongoose";

const styleSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    tone: { type: String },
    traits: {
      prefers_examples: { type: Boolean, default: false },
      tone_casual: { type: Boolean, default: false },
      likes_checks: { type: Boolean, default: false },
      detail_step_by_step: { type: Boolean, default: false },
      pacing_short_bursts: { type: Boolean, default: false }
    },
    structure: [String],
    phrasing_patterns: {
      affirmation: [String],
      transition: [String]
    }
  },
  { timestamps: true }
);

export default mongoose.model("Style", styleSchema);
