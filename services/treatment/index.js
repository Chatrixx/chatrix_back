import createTreatment from "./createTreatment.service.js";
import getTreatmentById from "./getTreatmentById.service.js";
import getTreatments from "./getTreatments.service.js";
import updateTreatment from "./updateTreatment.service.js";
import deleteTreatment from "./deleteTreatment.service.js";

const TreatmentService = {
  createTreatment,
  getTreatmentById,
  getTreatments,
  updateTreatment,
  deleteTreatment,
};

export default TreatmentService;
