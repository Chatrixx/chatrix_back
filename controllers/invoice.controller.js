import InvoiceService from "../services/invoices/index.js";
import { catchAsync } from "../utils/api/catchAsync.js";

const GetInvoices = catchAsync(async (req, res) => {
  const response = await InvoiceService.getInvoices(req.query);
  res.status(response.status).json(response.data);
});

const GetInvoiceById = catchAsync(async (req, res) => {
  const response = await InvoiceService.getInvoiceById(req.params.id);
  res.status(response.status).json(response.data);
});

const CreateInvoice = catchAsync(async (req, res) => {
  const response = await InvoiceService.createInvoice(req.body);
  res.status(response.status).json(response.data);
});

const UpdateInvoice = catchAsync(async (req, res) => {
  const response = await InvoiceService.updateInvoice(req.params.id, req.body);
  res.status(response.status).json(response.data);
});

const DeleteInvoice = catchAsync(async (req, res) => {
  const response = await InvoiceService.deleteInvoice(req.params.id);
  res.status(response.status).json(response.data);
});

const MarkAsPaid = catchAsync(async (req, res) => {
    const response = await InvoiceService.markAsPaid(req.params.id);
    res.status(response.status).json(response.data);
  });
  
const UpdateOverdueInvoices = catchAsync(async (req, res) => {
    const response = await InvoiceService.updateOverdueInvoices();
    res.status(response.status).json(response.data);
  });

const InvoiceController = {
  GetInvoices,
  GetInvoiceById,
  CreateInvoice,
  UpdateInvoice,
  DeleteInvoice,
  MarkAsPaid,
  UpdateOverdueInvoices,
};

export default InvoiceController;
