import Client from "../../db/models/Client.js";
import { IChannel } from "#constants/channels.js";

interface Parameters {
  clinic_id: string;
  channel: IChannel;
}

export default async function getAllChats({ clinic_id, channel }: Parameters) {
  const clients = await Client.find({ clinic_id }).select("full_name channels");

  const clientsWithChats = clients.map((client) => {
    const clientChannel = client.channels?.[channel];
    return {
      userId: client._id,
      full_name: client.full_name,
      chats: clientChannel?.messages || [],
      lastMessageDate: clientChannel?.last_message_date || new Date(0), // fallback to very old date if missing
    };
  });

  const sortedClientChats = clientsWithChats
    .filter((c) => c.lastMessageDate) // skipping clients who have no chat
    .sort(
      (a, b) =>
        Number(new Date(b.lastMessageDate)) -
        Number(new Date(a.lastMessageDate))
    );

  return sortedClientChats;
}
