import TreatmentService from "../services/treatment/index.js";
import { catchAsync } from "../utils/api/catchAsync.js";

const createTreatment = catchAsync(async (req, res) => {
  const result = await TreatmentService.createTreatment(req.body);
  res.status(result.status).json(result.data);
});

const getTreatmentById = catchAsync(async (req, res) => {
  const result = await TreatmentService.getTreatmentById(req.params.id);
  res.status(result.status).json(result.data);
});

const getTreatments = catchAsync(async (req, res) => {
  const result = await TreatmentService.getTreatments(req.query);
  res.status(result.status).json(result.data);
});

const updateTreatment = catchAsync(async (req, res) => {
  const result = await TreatmentService.updateTreatment(req.params.id, req.body);
  res.status(result.status).json(result.data);
});

const deleteTreatment = catchAsync(async (req, res) => {
  const result = await TreatmentService.deleteTreatment(req.params.id);
  res.status(result.status).json(result.data);
});

const TreatmentController = {
  createTreatment,
  getTreatmentById,
  getTreatments,
  updateTreatment,
  deleteTreatment,
};

export default TreatmentController;
