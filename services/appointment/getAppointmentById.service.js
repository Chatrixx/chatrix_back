import Appointment from "../../db/models/appointment.js";

export default async function getAppointmentById(id) {
  const appointment = await Appointment.findOne({ _id: id, isDeleted: false })
    .populate("user")
    .populate("treatment");

  if (!appointment) {
    return { status: 404, data: { error: "Appointment not found" } };
  }

  return { status: 200, data: appointment };
}
