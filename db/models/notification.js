import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  body: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  seen: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.models.Notification ||
  mongoose.model("Notification", NotificationSchema);
