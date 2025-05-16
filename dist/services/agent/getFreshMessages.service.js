import Client from "#db/models/Client.js";
import ApiError from "#utils/api/ApiError.js";
import { getChannelPrimaryKey } from "#utils/channel.js";
export default async function getFreshMessages(body, clinic_id) {
    const channelPrimaryKey = getChannelPrimaryKey(body.channel);
    if (!clinic_id) {
        throw new ApiError(400, "clinic_id is required");
    }
    if (!body.contact_data[channelPrimaryKey]) {
        throw new ApiError(400, `${channelPrimaryKey} is required`);
    }
    const client = await Client.findOne({
        clinic_id,
        [`channels.${body.channel}.profile_info.${channelPrimaryKey}`]: body.contact_data[channelPrimaryKey],
    });
    if (!client) {
        throw new ApiError(400, `No such client`);
    }
    const messages = client.channels?.[body.channel]?.messages;
    const fresh_messages = messages?.filter((message) => message.fresh && message.role === "agent");
    if (!fresh_messages || fresh_messages.length === 0) {
        throw new ApiError(404, "No fresh messages.");
    }
    await Client.updateOne({
        clinic_id,
        [`channels.${body.channel}.profile_info.${channelPrimaryKey}`]: body.contact_data[channelPrimaryKey],
    }, {
        $set: {
            [`channels.${body.channel}.messages.$[elem].fresh`]: false,
        },
    }, {
        arrayFilters: [{ "elem.fresh": true }],
    });
    return {
        version: "v2",
        content: {
            type: body.channel,
            messages: fresh_messages.map((message) => ({
                type: message.type,
                text: message.content,
            })),
            actions: [],
            quick_replies: [],
        },
    };
}
