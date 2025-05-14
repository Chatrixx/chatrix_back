import { CHANNELS } from "#constants/channels.js";
import Client from "#db/models/Client.js";
import ApiError from "#utils/api/ApiError.js";
export default async function getChatsByClient({ client_id, channel, }) {
    if (!Object.values(CHANNELS).includes(channel)) {
        throw new ApiError(400, "Invalid channel. Must be 'instagram' or 'whatsapp'.");
    }
    // Find the client and select only the required channel's messages
    const client = await Client.findById(client_id).select(`channels.${channel}.messages`);
    if (!client?.channels?.[channel]) {
        return null;
    }
    return {
        client: {
            _id: client._id,
            name: client.full_name,
            email: client.email,
            phone: client.phone,
            channels: client.channels,
        },
        messages: client.channels[channel].messages,
    };
}
