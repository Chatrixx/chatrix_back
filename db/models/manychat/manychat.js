import mongoose from "mongoose";

const ManyChatMessageSchema = new mongoose.Schema({
  input: String,
  full_name: String,
  first_name: String,
  last_name: String,
  contact_data: mongoose.Schema.Types.Mixed,
  email: String,
  channel: String,
  clinic_id: String,
});

export default mongoose.models.ManyChatMessage ||
  mongoose.model("ManyChatMessage", ManyChatMessageSchema);
