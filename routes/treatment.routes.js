import express from "express";
import TreatmentController from "../controllers/treatment.controller.js";


const router = express.Router();


router.post("/", TreatmentController.createTreatment);
router.get("/", TreatmentController.getTreatments);
router.get("/:id", TreatmentController.getTreatmentById);
router.patch("/:id", TreatmentController.updateTreatment);
router.delete("/:id", TreatmentController.deleteTreatment);

export default router;
