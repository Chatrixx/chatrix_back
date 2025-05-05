import Treatment from "../../db/models/treatment.js";

export default async function getTreatments(query) {
  const mongoQuery = { isDeleted: { $ne: true } };

  for (const key in query) {
    if (query[key]) {
      if (key.endsWith("_gte") || key.endsWith("_lte")) {
        const [field, operator] = key.split("_");
        mongoQuery[field] = mongoQuery[field] || {};
        mongoQuery[field][operator === "gte" ? "$gte" : "$lte"] = new Date(query[key]);
      } else {
        mongoQuery[key] = query[key];
      }
    }
  }

  const treatments = await Treatment.find(mongoQuery).populate("user").populate("appointments");
  return { status: 200, data: treatments };
}
