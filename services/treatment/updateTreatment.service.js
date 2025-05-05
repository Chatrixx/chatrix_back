import Treatment from "../../db/models/treatment.js";
import Appointment from "../../db/models/appointment.js";

export default async function updateTreatment(id, update) {
  const treatment = await Treatment.findByIdAndUpdate(id, update, {
    new: true,
  });

  if (!treatment) {
    return { status: 404, data: { message: "Treatment not found" } };
  }

  if (update.appointments?.length > 0) {
    // First clear this treatment from any previously linked appointments
    await Appointment.updateMany(
      { treatment: id },
      { $unset: { treatment: "" } }
    );

    // Then assign the treatment ID to the new set
    await Appointment.updateMany(
      { _id: { $in: update.appointments } },
      { $set: { treatment: treatment._id } }
    );
  }

  return { status: 200, data: treatment };
}
