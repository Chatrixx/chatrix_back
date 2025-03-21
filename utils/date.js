export function getReadableDate(dateInput) {
  const now = new Date();
  const postDate = new Date(dateInput);

  const isToday = now.toDateString() === postDate.toDateString();
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = yesterday.toDateString() === postDate.toDateString();

  const options = { hour: "2-digit", minute: "2-digit", hour12: false };

  if (isToday) {
    return `Bugün ${postDate.toLocaleTimeString("tr-TR", options)}`;
  } else if (isYesterday) {
    return `Dün ${postDate.toLocaleTimeString("tr-TR", options)}`;
  } else {
    const dateOptions = { day: "numeric", month: "long", year: "numeric" };
    return `${postDate.toLocaleDateString(
      "tr-TR",
      dateOptions
    )} ${postDate.toLocaleTimeString("tr-TR", options)}`;
  }
}
