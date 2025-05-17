import ClientController from "#controllers/client.controller.js";
import express from "express";
const router = express.Router();

router.get("", ClientController.GetClients);
router.get("/:id", ClientController.GetClientById);

export default router;
