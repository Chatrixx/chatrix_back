import { NotificationDocument } from "#db/models/Notification.js";
import axios from "axios";

export const botTriggerUrl =
  "https://api.telegram.org/bot7560185271:AAH0SzdiD7HixCg9iggUjMIFCPebq6Hk0rQ/sendMessage";

export const test_ids = [
  "7110188599", //Uveys
];

interface Props {
  chatId: string | undefined | null;
  notification: NotificationDocument;
}

export const sendTelegramBotMessage = ({ chatId, notification }: Props) => {
  const { title, body } = notification;
  const phoneNumber = body?.phoneNumber ?? "--No Phone Number";
  const chatSummary = body?.summary ?? "--No Summary Found";
  const userFullName = title.split("Telefon numarası")[0];

  const notificationContent = ` ### Yeni Randevu Talebi \n **👤 İsim**: ${userFullName} \n **📞 Telefon Numarası**: ${
    phoneNumber as string
  } \n **💬 Sohbet Özeti:** ${chatSummary as string}

`;

  const receivers = [...test_ids, chatId];

  receivers.forEach((c_id) => {
    if (c_id) {
      axios.post(botTriggerUrl, {
        parse_mode: "MarkdownV2",
        chat_id: c_id,
        text: notificationContent,
      });
    }
  });
};
