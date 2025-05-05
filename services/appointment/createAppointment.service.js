import Appointment from "../../db/models/appointment.js";
import Treatment from "../../db/models/treatment.js";

export default async function createAppointment(data) {
  const appointment = await Appointment.create(data);

  // Add appointment to the treatment's list
  if (data.treatment) {
    await Treatment.findByIdAndUpdate(data.treatment, {
      $addToSet: { appointments: appointment._id },
    });
  }

  return { status: 201, data: appointment };
}
