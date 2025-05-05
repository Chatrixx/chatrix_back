import Treatment from "../../db/models/treatment.js";
import Appointment from "../../db/models/appointment.js";

export default async function createTreatment(data) {
  const treatment = await Treatment.create(data);

  // Link treatment to appointments if provided
  if (data.appointments?.length > 0) {
    await Appointment.updateMany(
      { _id: { $in: data.appointments } },
      { $set: { treatment: treatment._id } }
    );
  }

  return { status: 201, data: treatment };
}
