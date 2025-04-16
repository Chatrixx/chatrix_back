import User from "../../db/models/User.js";

export default async function getAllChats({ clinic_id }) {
  try {
    const users = await User.find({ clinic_id: clinic_id }).select(
      "full_name channels"
    );

    const usersWithChats = users.map((user) => {
      return {
        userId: user._id,
        full_name: user.full_name,
        chats: {
          instagram: user.channels.instagram
            ? user.channels.instagram.messages
            : [],
          whatsapp: user.channels.whatsapp
            ? user.channels.whatsapp.messages
            : [],
        },
      };
    });

    return usersWithChats;
  } catch (error) {
    console.error("Error fetching all users and their chats:", error);
    throw new Error("Failed to fetch all chats");
  }
}
