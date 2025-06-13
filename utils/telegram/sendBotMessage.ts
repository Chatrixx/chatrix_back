import { NotificationDocument } from "#db/models/Notification.js";
import axios from "axios";

export const botTriggerUrl =
  "https://api.telegram.org/bot7560185271:AAH0SzdiD7HixCg9iggUjMIFCPebq6Hk0rQ/sendMessage";

export const test_id = "7110188599";

interface Props {
  chatId: string | undefined | null;
  notification: NotificationDocument;
}

export const sendTelegramBotMessage = async ({
  chatId,
  notification,
}: Props) => {
  const { title, body } = notification;
  const phoneNumber = body?.phoneNumber ?? "--No Phone Number";
  const chatSummary = body?.summary ?? "--No Summary Found";
  const notificationTitle = title ?? "Yeni Bildirim";

  const notificationContent = ` ### Yeni Randevu Talebi \n **👤 Danışan**: ${notificationTitle} \n **📞 Telefon Numarası**: ${
    phoneNumber as string
  } \n **💬 Sohbet Özeti:** ${chatSummary as string}`;

  await axios.post(botTriggerUrl, {
    parse_mode: "MarkdownV2",
    chat_id: test_id,
    text: notificationContent,
  });
  if (!chatId) return;

  await axios.post(botTriggerUrl, {
    parse_mode: "MarkdownV2",
    chat_id: chatId,
    text: notificationContent,
  });
};
