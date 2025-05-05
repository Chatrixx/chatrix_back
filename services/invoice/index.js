import getInvoices from "./getInvoices.service.js";
import getInvoiceById from "./getInvoiceById.service.js";
import createInvoice from "./createInvoice.service.js";
import updateInvoice from "./updateInvoice.service.js";
import deleteInvoice from "./deleteInvoice.service.js";
import markAsPaid from "./markAsPaid.service.js";
import updateOverdueInvoices from "./updateOverdueInvoices.service.js";

const InvoiceService = {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  markAsPaid,
  updateOverdueInvoices,
};

export default InvoiceService;
