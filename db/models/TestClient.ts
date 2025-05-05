import mongoose, { HydratedDocument, InferSchemaType, Model } from "mongoose";

const TestClientSchema = new mongoose.Schema({
  clinic_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Clinic",
  },
  messages: [{ type: mongoose.Schema.Types.Mixed }],
  thread_id: String,
});

export type ITestClient = InferSchemaType<typeof TestClientSchema>;
export type TestClientDocument = HydratedDocument<ITestClient>;

export default (mongoose.models.TestClient as Model<ITestClient>) ||
  mongoose.model<ITestClient>("TestClient", TestClientSchema);
