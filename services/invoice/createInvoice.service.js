import Invoice from "../../db/models/invoice.js";

export default async function createInvoice(data) {
  const invoice = await Invoice.create(data);
  return { status: 201, data: invoice };
}
