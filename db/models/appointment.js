import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  treatment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Treatment", // optional reference to the treatment it belongs to
    default: null,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["planned", "verified", "cancelled", "completed"],
    default: "planned",
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Appointment ||
  mongoose.model("Appointment", AppointmentSchema);
