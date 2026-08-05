const dateFormatter = new Intl.DateTimeFormat("es-ES", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const quantityFormatter = new Intl.NumberFormat("es-ES", {
  useGrouping: true,
});

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return "Fecha no disponible";
  }
  return dateFormatter.format(date);
}

export function formatQuantity(cantidad: number): string {
  return quantityFormatter.format(cantidad);
}
