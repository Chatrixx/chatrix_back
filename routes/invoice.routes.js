import express from "express";
import InvoiceController from "../controllers/invoice.controller.js";

const router = express.Router();

// Create invoice
router.post("/", InvoiceController.CreateInvoice);

// Get all invoices (with filters)
router.get("/", InvoiceController.GetInvoices);

// Get invoice by ID
router.get("/:id", InvoiceController.GetInvoiceById);

// Update invoice
router.patch("/:id", InvoiceController.UpdateInvoice);

// Delete invoice
router.delete("/:id", InvoiceController.DeleteInvoice);

// Mark invoice as paid
router.patch("/:id/mark-paid", InvoiceController.MarkAsPaid);

// Update overdue invoices based on due_date
router.patch("/update-overdues", InvoiceController.UpdateOverdueInvoices);

export default router;
