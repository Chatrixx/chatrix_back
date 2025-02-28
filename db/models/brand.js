import mongoose from "mongoose";

const BrandSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  clinic_ids: {
    type: Array,
    required: true,
  },
});
