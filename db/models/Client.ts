import mongoose, { HydratedDocument, InferSchemaType, Model } from "mongoose";

const InstagramSchema = new mongoose.Schema({
  username: String,
  name: String,
  thread_id: String,
  profile_info: mongoose.Schema.Types.Mixed,
  messages: [{ type: mongoose.Schema.Types.Mixed }],
  first_message_date: Date,
  last_message_date: Date,
  last_updated: Date,
  phone_giving_date: Date,
});

const WhatsappSchema = new mongoose.Schema({
  profile_info: mongoose.Schema.Types.Mixed,
  messages: [{ type: mongoose.Schema.Types.Mixed }],
  last_updated: Date,
  first_message_date: Date,
  last_message_date: Date,
  phone_giving_date: Date,
});

const ChannelsSchema = new mongoose.Schema({
  instagram: InstagramSchema,
  whatsapp: WhatsappSchema,
});

const TreatmentSchema = new mongoose.Schema({
  name: String,
  date: String,
  status: String,
});

const PortfolioSchema = new mongoose.Schema({
  appointmentCount: Number,
  appointments: [mongoose.Schema.Types.Mixed], // Empty array, could be expanded
  treatments: [TreatmentSchema],
});

const ClientSchema = new mongoose.Schema({
  full_name: String,
  email: String,
  phone: String,
  profile_pic: String,
  clinic_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Clinic",
  },
  medicasimple: mongoose.Schema.Types.Mixed,
  initial_channel: String,
  channels: ChannelsSchema,
  portfolio: PortfolioSchema,
});

export type IClient = InferSchemaType<typeof ClientSchema>;
export type ClientDocument = HydratedDocument<IClient>;

export default (mongoose.models.Client as Model<IClient>) ||
  mongoose.model<IClient>("Client", ClientSchema);
