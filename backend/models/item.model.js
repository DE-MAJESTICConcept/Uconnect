import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  itemName: { type: String, required: true, trim: true },

  // Found item fields
  dateFound: {
    type: Date,
    required: function () { return this.status === "found"; },
  },
  timeFound: {
    type: String,
    required: function () { return this.status === "found"; },
  },
  foundLocation: {
    type: String,
    required: function () { return this.status === "found"; },
    trim: true,
  },

  // Lost item fields
  dateLost: {
    type: Date,
    required: function () { return this.status === "lost"; },
  },
  timeLost: {
    type: String,
    required: function () { return this.status === "lost"; },
  },
  lastLocation: {
    type: String,
    required: function () { return this.status === "lost"; },
    trim: true,
  },

  itemDescription: { type: String, required: true, trim: true },
  image: { type: String, default: "" },

  finderInfo: {
    fullName: { type: String, required: true, trim: true },
    matricNumber: { type: String, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
  },

  shareInfo: { type: Boolean, default: false },
  adminContact: { type: Boolean, default: false },

  status: {
    type: String,
    enum: ["found", "lost", "claimed", "archived"],
    default: "found",
  },

  dateReported: { type: Date, default: Date.now },
});

export default mongoose.model("Item", itemSchema);
