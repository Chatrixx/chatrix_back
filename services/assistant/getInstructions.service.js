import Clinic from "../../db/models/clinic.js";
import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function getInstructions(body) {
  const { clinic_id } = body;

  if (!clinic_id) {
    return {
      status: 400,
      data: { error: "clinic_id is required" },
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


  if (clinic.openai_assistant.instructions) {
    return {
      status: 200,
      data: {
        assistant_id,
        instructions: clinic.openai_assistant.instructions,
        source: "mongo",
      },
    };
  }


  try {
    const assistant = await openai.beta.assistants.retrieve(assistant_id);
    const fetchedInstructions = assistant.instructions;


    clinic.openai_assistant = {
      ...clinic.openai_assistant,
      instructions: fetchedInstructions,
    };

    await clinic.save();

    return {
      status: 200,
      data: {
        assistant_id,
        instructions: fetchedInstructions,
        source: "openai",
      },
    };
  } catch (error) {
    return {
      status: 500,
      data: {
        error: "Failed to retrieve instructions from OpenAI",
        message: error.message,
      },
    };
  }
}
