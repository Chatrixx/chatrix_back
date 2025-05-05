import Invoice from "../../db/models/invoice.js";

export default async function deleteInvoice(id) {
  const result = await Invoice.findByIdAndDelete(id);
  return { status: result ? 200 : 404, data: result || { error: "Invoice not found" } };
}
