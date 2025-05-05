import Invoice from "../../db/models/invoice.js";

export default async function updateOverdueInvoices() {
  const today = new Date();
  const result = await Invoice.updateMany(
    { status: "unpaid", due_date: { $lt: today } },
    { $set: { status: "overdue" } }
  );
  return { status: 200, data: result };
}
