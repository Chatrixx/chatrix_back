import createAppointment from "./createAppointment.service.js";
import getAppointmentById from "./getAppointmentById.service.js";
import getAppointments from "./getAppointments.service.js";
import updateAppointment from "./updateAppointment.service.js";
import deleteAppointment from "./deleteAppointment.service.js";

const AppointmentService = {
  createAppointment,
  getAppointmentById,
  getAppointments,
  updateAppointment,
  deleteAppointment,
};

export default AppointmentService;
