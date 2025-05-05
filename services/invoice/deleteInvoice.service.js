import Invoice from "../../db/models/invoice.js";

export default async function deleteInvoice(id) {
  await Invoice.findByIdAndUpdate(id, { isDeleted: true });
  return { status: 200, data: { message: "Invoice marked as deleted" } };
}
