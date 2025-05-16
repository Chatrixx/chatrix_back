import mongoose from "mongoose";
const TestClientSchema = new mongoose.Schema({
    clinic_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Clinic",
    },
    messages: [{ type: mongoose.Schema.Types.Mixed }],
    thread_id: String,
});
export default mongoose.models.TestClient ||
    mongoose.model("TestClient", TestClientSchema);
