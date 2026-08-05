import { PackageIcon } from "@/components/ui/icons";

interface EmptyStateProps {
  variant: "no-products" | "no-results";
}

export function EmptyState({ variant }: EmptyStateProps) {
  const isNoProducts = variant === "no-products";

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center transition-colors dark:border-neutral-800 dark:bg-neutral-900"
    >
      <PackageIcon className="h-12 w-12 text-slate-300 dark:text-neutral-700" />
      <div className="flex flex-col gap-1">
        <p className="text-base font-semibold text-slate-700 dark:text-neutral-200">
          {isNoProducts
            ? "Aún no hay productos"
            : "No hay resultados para tu búsqueda"}
        </p>
        <p className="text-sm text-slate-500 dark:text-neutral-400">
          {isNoProducts
            ? "Usa el formulario para crear tu primer producto."
            : "Prueba con otro término o limpia el filtro."}
        </p>
      </div>
    </div>
  );
}
