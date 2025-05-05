import mongoose, { HydratedDocument, InferSchemaType, Model } from "mongoose";
import bcrypt from "bcrypt";

const ClinicShema = new mongoose.Schema({
  brand_id: {
    type: String,
  },
  name: {
    type: String,
  },
  logo: {
    type: String,
  },
  address: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    required: true,
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

export type IClinic = InferSchemaType<typeof ClinicShema>;
export type ClinicDocument = HydratedDocument<IClinic>;

ClinicShema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password as string);
};

export default (mongoose.models.Clinic as Model<IClinic>) ||
  mongoose.model<IClinic>("Clinic", ClinicShema);
