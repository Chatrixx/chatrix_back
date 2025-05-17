import ClientService from "#services/clients/index.js";
import { AuthenticatedRequest } from "#types/request.js";
import { catchAsync } from "#utils/api/catchAsync.js";
import { Response } from "express";

const GetClients = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const clients = await ClientService.getClients({
      clinic_id: req.auth.user.id,
      searchTerm: req.query.searchTerm,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    });
    res.json(clients);
  }
);

const GetClientById = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const client = await ClientService.getClientById({
      clinic_id: req.auth.user.id,
      id: req.params.id,
    });
    res.json(client);
  }
);

const ClientController = {
  GetClients,
  GetClientById,
};

export default ClientController;
