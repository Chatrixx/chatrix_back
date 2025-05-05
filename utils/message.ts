export function removeEmojisAndExclamations(str: string) {
  if (!str) return "";
  // Unicode regex to match emojis but keep flower emojis
  const emojiRegex =
    /([\p{Emoji_Presentation}\p{Extended_Pictographic}])(?<![\uD83C\uDF3A-\uD83C\uDF3F])/gu;
  // Remove emojis (except flowers) and exclamation marks
  return str.replace(emojiRegex, "").replace(/!/g, "");
}

export function addLeadingNameToMessage(message: string, name: string) {
  if (!name) return message;
  return `Selam, ben ${name}, ${message}`;
}
