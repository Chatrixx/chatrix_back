import express from "express";
import AppointmentController from "../controllers/appointment.controller.js";

const router = express.Router();



// Create a new appointment
router.post("/", AppointmentController.createAppointment);

// Get all appointments with filters
router.get("/", AppointmentController.getAppointments);

// Get one appointment by ID
router.get("/:id", AppointmentController.getAppointmentById);

// Update appointment by ID
router.put("/:id", AppointmentController.updateAppointment);

// Soft delete appointment by ID
router.delete("/:id", AppointmentController.deleteAppointment);

export default router;
