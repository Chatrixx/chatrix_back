import mongoose, { HydratedDocument, InferSchemaType, Model } from "mongoose";

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
  clinic_id: { type: mongoose.Schema.Types.ObjectId, ref: "Clinic" },
});

export type INotification = InferSchemaType<typeof NotificationSchema>;
export type NotificationDocument = HydratedDocument<INotification>;

export default (mongoose.models.Notification as Model<INotification>) ||
  mongoose.model<INotification>("Notification", NotificationSchema);
