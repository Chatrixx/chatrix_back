import mongoose from "mongoose";

const ClinicShema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  brand_id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
  },
  address: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },

  website: {
    type: String,
  },

  openai_assistant: {
    type: mongoose.Schema.Types.Mixed,
  },
  medicasimple: {
    type: mongoose.Schema.Types.Mixed,
  },
  treatments: {
    type: Array,
  },
  notifications: {
    type: Array,
  },
});

export default mongoose.models.Clinic || mongoose.model("Clinic", ClinicShema);
