import Appointment from "../../db/models/appointment.js";
import Treatment from "../../db/models/treatment.js";

export default async function deleteAppointment(id) {
  const appointment = await Appointment.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );

  // Remove it from treatment if assigned
  if (appointment?.treatment) {
    await Treatment.findByIdAndUpdate(appointment.treatment, {
      $pull: { appointments: appointment._id },
    });
  }

  return { status: 200, data: { message: "Appointment marked as deleted" } };
}
