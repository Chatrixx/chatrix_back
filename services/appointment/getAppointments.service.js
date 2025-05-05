import Appointment from "../../db/models/appointment.js";

export default async function getAppointments(query) {
  const mongoQuery = { isDeleted: false }; // Ensure only non-deleted ones are returned

  for (const key in query) {
    if (query[key]) {
      if (key.endsWith("_gte") || key.endsWith("_lte")) {
        const [field, operator] = key.split("_");
        mongoQuery[field] = mongoQuery[field] || {};
        mongoQuery[field][operator === "gte" ? "$gte" : "$lte"] = new Date(query[key]);
      } else {
        mongoQuery[key] = query[key];
      }
    }
  }

  const appointments = await Appointment.find(mongoQuery)
    .populate("user")
    .populate("treatment");

  return { status: 200, data: appointments };
}
