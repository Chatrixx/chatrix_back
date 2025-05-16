import ClientService from "#services/clients/index.js";
import { catchAsync } from "#utils/api/catchAsync.js";
const GetClients = catchAsync(async (req, res) => {
    const clients = await ClientService.getClients({
        clinic_id: req.auth.user.id,
        searchTerm: req.query.searchTerm,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
    });
    res.json(clients);
});
const ClientController = {
    GetClients,
};
export default ClientController;
