import Invoice from "../../db/models/invoice.js";

export default async function getInvoiceById(id) {
  const invoice = await Invoice.findById(id).populate("user");
  return { status: invoice ? 200 : 404, data: invoice || { error: "Invoice not found" } };
}
