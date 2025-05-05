import Treatment from "../../db/models/treatment.js";

export default async function getTreatmentById(id) {
  const treatment = await Treatment.findById(id)
    .populate("user")
    .populate("appointments");

  if (!treatment || treatment.isDeleted) {
    return { status: 404, data: { error: "Treatment not found" } };
  }

  return { status: 200, data: treatment };
}
