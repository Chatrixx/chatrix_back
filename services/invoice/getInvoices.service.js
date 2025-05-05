import Invoice from "../../db/models/invoice.js";
import updateOverdueInvoices from "./updateOverdueInvoices.service.js";

export default async function getInvoices(query) {
  
  await updateOverdueInvoices();
  
  const mongoQuery = {};

  // Exact matches
  if (query.user_id) mongoQuery.user = query.user_id;
  if (query.status) mongoQuery.status = query.status;
  if (query.currency) mongoQuery.currency = query.currency;
  if (query.invoice_number) mongoQuery.invoice_number = query.invoice_number;

  // Amount filters
  if (query.amount_gte || query.amount_lte) {
    mongoQuery.amount = {};
    if (query.amount_gte) mongoQuery.amount.$gte = parseFloat(query.amount_gte);
    if (query.amount_lte) mongoQuery.amount.$lte = parseFloat(query.amount_lte);
  }

  // Due date filters
  if (query.due_date_gte || query.due_date_lte) {
    mongoQuery.due_date = {};
    if (query.due_date_gte) mongoQuery.due_date.$gte = new Date(query.due_date_gte);
    if (query.due_date_lte) mongoQuery.due_date.$lte = new Date(query.due_date_lte);
  } else if (query.due_date) {
    mongoQuery.due_date = new Date(query.due_date);
  }

  // Created at filters
  if (query.created_at_gte || query.created_at_lte) {
    mongoQuery.created_at = {};
    if (query.created_at_gte) mongoQuery.created_at.$gte = new Date(query.created_at_gte);
    if (query.created_at_lte) mongoQuery.created_at.$lte = new Date(query.created_at_lte);
  }

  const invoices = await Invoice.find(mongoQuery).populate("user");
  return { status: 200, data: invoices };
}
