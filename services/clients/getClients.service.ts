import Client from "#db/models/Client.js";
import { MongoObjectId } from "#utils/mongoose/casters.js";

interface Parameters {
  searchTerm: string;
  startDate?: Date;
  endDate?: Date;
  clinic_id: string;
}

export default async function getClients({
  clinic_id,
  searchTerm,
  startDate,
  endDate,
}: Parameters) {
  try {
    const query: any = {
      clinic_id: MongoObjectId(clinic_id),
    };
    if (searchTerm?.length > 0) {
      query.name = { $regex: new RegExp(searchTerm, "i") };
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    const clients = await Client.find(query);
    return clients;
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error;
  }
}
