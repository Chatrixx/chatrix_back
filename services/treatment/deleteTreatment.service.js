import Treatment from "../../db/models/treatment.js";

export default async function deleteTreatment(id) {
  const treatment = await Treatment.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );

  if (!treatment) {
    return { status: 404, data: { error: "Treatment not found" } };
  }

  return { status: 200, data: { message: "Treatment soft-deleted successfully" } };
}
