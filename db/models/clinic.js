import mongoose from "mongoose";
import bcrypt from "bcrypt";
/**
 * @type {mongoose.SchemaDefinitionProperty}
 */
const ClinicShema = new mongoose.Schema({
  clinic_id: {
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
  password: {
    type: String,
    required: true,
  },
});

ClinicShema.pre("save", async function (next) {
  if (this.isModified("password")) {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
  }
  next();
});
// Compare password
ClinicShema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.models.Clinic || mongoose.model("Clinic", ClinicShema);
