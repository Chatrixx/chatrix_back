import ClientController from "#controllers/client.controller.js";
import express from "express";
const router = express.Router();

router.get("", ClientController.GetClients);

export default router;
