import Client from "#db/models/Client.js";
import ApiError from "#utils/api/ApiError";
import { MongoObjectId } from "#utils/mongoose/casters.js";

interface Parameters {
  id: string;
  clinic_id: string;
}

export default async function getClientById({ id, clinic_id }: Parameters) {
  try {
    const client = await Client.findById(MongoObjectId(id)).orFail(() => {
      throw new ApiError(404, "Hasta Bulunamadı.");
    });
    if (String(client.clinic_id) !== clinic_id) {
      throw new ApiError(401, "Forbidden");
    }

    return client;
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error;
  }
}
