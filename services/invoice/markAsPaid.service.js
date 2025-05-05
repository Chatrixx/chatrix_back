import Invoice from "../../db/models/invoice.js";

export default async function markAsPaid(id) {
  const updated = await Invoice.findByIdAndUpdate(id, { status: "paid" }, { new: true });
  return { status: updated ? 200 : 404, data: updated || { error: "Invoice not found" } };
}
