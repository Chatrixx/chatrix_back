import Invoice from "../../db/models/invoice.js";

export default async function updateInvoice(id, updates) {
  const invoice = await Invoice.findByIdAndUpdate(id, updates, { new: true });
  return { status: invoice ? 200 : 404, data: invoice || { error: "Invoice not found" } };
}
