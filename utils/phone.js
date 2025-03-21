export function extractTurkishPhoneNumber(text) {
  const regex = /(?:\+?90|0)?\s*5\d{2}\s*\d{3}\s*\d{2}\s*\d{2}/;
  const match = text.match(regex);
  return match ? match[0].replace(/\s+/g, "") : null;
}
