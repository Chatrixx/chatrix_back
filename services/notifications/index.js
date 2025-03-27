import getAll from "./getAll.service.js";
import markSeenById from "./markSeenById.service.js";
import markAllSeen from "./markAllSeen.service.js";
import getById from "./getById.service.js";

const NotificationsService = {
  getAll,
  markSeenById,
  markAllSeen,
  getById,
};

export default NotificationsService;
