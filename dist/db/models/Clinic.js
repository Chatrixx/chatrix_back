import mongoose from "mongoose";
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
ClinicShema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};
export default mongoose.models.Clinic ||
    mongoose.model("Clinic", ClinicShema);
