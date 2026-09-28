/**
 * Formatea una fecha para mostrarla de manera consistente
 * en toda la aplicación.
 *
 * Ejemplo:
 * 2027-07-15T00:00:00.000Z -> 15/JUL/27
 */
export function formatDate(
  date: string | Date | null | undefined
): string {
  if (!date) {
    return "No aplica";
  }

  const parsedDate =
    date instanceof Date
      ? date
      : new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Fecha inválida";
  }

  const day = String(
    parsedDate.getUTCDate()
  ).padStart(2, "0");

  const months = [
    "ENE",
    "FEB",
    "MAR",
    "ABR",
    "MAY",
    "JUN",
    "JUL",
    "AGO",
    "SEP",
    "OCT",
    "NOV",
    "DIC",
  ];

  const month =
    months[parsedDate.getUTCMonth()];

  const year = String(
    parsedDate.getUTCFullYear()
  ).slice(-2);

  return `${day}/${month}/${year}`;
}