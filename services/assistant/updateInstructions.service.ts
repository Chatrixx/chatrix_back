import Clinic from "#db/models/Clinic.js";
import ApiError from "#utils/api/ApiError.js";
import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface UpdateInstructionsParams {
  clinic_id: string;
  instructions: any;
}

export default async function updateInstructions(
  body: UpdateInstructionsParams
) {
  const { clinic_id, instructions } = body;

  if (!clinic_id || !instructions || typeof instructions !== "string") {
    throw new ApiError(400, "clinic_id and instructions are required");
  }

  const clinic = await Clinic.findById(clinic_id).orFail(() => {
    throw new ApiError(400, "No clinic found with given id.");
  });

  if (!clinic.openai_assistant?.assistant_id) {
    throw new ApiError(400, "Assistant not found for this clinic");
  }

  const assistant_id = clinic.openai_assistant.assistant_id;

  await openai.beta.assistants.update(assistant_id, {
    instructions,
  });

  clinic.openai_assistant = {
    ...clinic.openai_assistant,
    instructions,
  };

  await clinic.save();

  return {
    message: "Instructions updated successfully",
    assistant_id,
    updated_instructions: instructions,
  };
}
