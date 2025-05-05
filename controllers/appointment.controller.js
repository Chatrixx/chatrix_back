import AppointmentService from "../services/appointment/index.js";
import { catchAsync } from "../utils/api/catchAsync.js";

// Create a new appointment
const createAppointment = catchAsync(async (req, res) => {
  const result = await AppointmentService.createAppointment(req.body);
  return res.status(result.status).json(result.data);
});

// Get one appointment by ID
const getAppointmentById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AppointmentService.getAppointmentById(id);
  return res.status(result.status).json(result.data);
});

// Get all appointments (filterable)
const getAppointments = catchAsync(async (req, res) => {
  const result = await AppointmentService.getAppointments(req.query);
  return res.status(result.status).json(result.data);
});

// Update appointment by ID
const updateAppointment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AppointmentService.updateAppointment(id, req.body);
  return res.status(result.status).json(result.data);
});

// Soft delete appointment by ID
const deleteAppointment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AppointmentService.deleteAppointment(id);
  return res.status(result.status).json(result.data);
});

const AppointmentController = {
  createAppointment,
  getAppointmentById,
  getAppointments,
  updateAppointment,
  deleteAppointment,
};

export default AppointmentController;
