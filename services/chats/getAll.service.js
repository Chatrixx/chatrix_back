import User from "../../db/models/User.js";

export default async function getAllChats({ clinic_id, channel }) {
  const users = await User.find({ clinic_id }).select("full_name channels");

  const usersWithChats = users.map((user) => {
    const userChannel = user.channels[channel];

    return {
      userId: user._id,
      full_name: user.full_name,
      chats: userChannel?.messages || [],
      lastMessageDate: userChannel?.last_message_date || new Date(0), // fallback to very old date if missing
    };
  });

  // Now sort users based on their last message date, newest first
  const sortedUsers = usersWithChats
    .filter((user) => user.lastMessageDate) // remove users who have no chat
    .sort((a, b) => new Date(b.lastMessageDate) - new Date(a.lastMessageDate));

  // Optionally, if you don't want to expose lastMessageDate field in output:
  return sortedUsers;
}
