import Appointment from "../../db/models/appointment.js";
import Treatment from "../../db/models/treatment.js";

export default async function updateAppointment(id, update) {
  const existing = await Appointment.findById(id);
  const updated = await Appointment.findByIdAndUpdate(id, update, {
    new: true,
  });

  // Remove from previous treatment if changed
  if (existing.treatment && existing.treatment.toString() !== update.treatment) {
    await Treatment.findByIdAndUpdate(existing.treatment, {
      $pull: { appointments: existing._id },
    });
  }

  // Add to new treatment
  if (update.treatment && existing.treatment?.toString() !== update.treatment) {
    await Treatment.findByIdAndUpdate(update.treatment, {
      $addToSet: { appointments: existing._id },
    });
  }

  return { status: 200, data: updated };
}
