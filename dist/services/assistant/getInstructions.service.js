import Clinic from "#db/models/Clinic.js";
import ApiError from "#utils/api/ApiError.js";
import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export default async function getInstructions(body) {
    const { clinic_id } = body;
    if (!clinic_id) {
        throw new ApiError(400, "clinic_id is required");
    }
    const clinic = await Clinic.findById(clinic_id).orFail(() => {
        throw new ApiError(400, "No clinic found with given id.");
    });
    if (!clinic.openai_assistant?.assistant_id) {
        throw new ApiError(404, "OpenAI assistant id not found for this clinic.");
    }
    const assistant = await openai.beta.assistants.retrieve(clinic.openai_assistant?.assistant_id);
    const baseInstructions = assistant.instructions;
    const assistant_id = clinic.openai_assistant.assistant_id;
    if (clinic.openai_assistant.instructions) {
        return {
            status: 200,
            data: {
                assistant_id,
                baseInstructions,
                instructions: clinic.openai_assistant.instructions,
                source: "mongo",
            },
        };
    }
}
