import Clinic from "../../db/models/clinic.js";
import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function updateInstructions(body) {
  const { clinic_id, instructions } = body;

  if (!clinic_id || !instructions || typeof instructions !== "string") {
    return {
      status: 400,
      data: { error: "clinic_id and instructions are required" },
    };
  }


  const clinic = await Clinic.findById(clinic_id);

  if (!clinic || !clinic.openai_assistant?.assistant_id) {
    return {
      status: 404,
      data: { error: "Assistant not found for this clinic" },
    };
  }

  const assistant_id = clinic.openai_assistant.assistant_id;

  try {

    await openai.beta.assistants.update(assistant_id, {
      instructions,
    });


    clinic.openai_assistant = {
      ...clinic.openai_assistant,
      instructions,
    };

    await clinic.save(); 

    return {
      status: 200,
      data: {
        message: "Instructions updated successfully",
        assistant_id,
        updated_instructions: instructions,
      },
    };
  } catch (error) {
    return {
      status: 500,
      data: {
        error: "Failed to update assistant",
        message: error.message,
      },
    };
  }
}
