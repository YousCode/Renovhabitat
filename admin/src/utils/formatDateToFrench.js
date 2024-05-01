export default function formatDateToFrench(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const options = {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  return date.toLocaleString("fr-FR", options);
}
