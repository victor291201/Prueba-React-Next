import { forwardRef } from "react";
import type { KeyboardEvent } from "react";
import { motion } from "framer-motion";
import type { Product } from "@/types/product";
import { Button } from "@/components/ui/Button";
import { TrashIcon, PencilIcon } from "@/components/ui/icons";
import { formatDate, formatQuantity } from "@/utils/formatters";

interface ProductCardProps {
  product: Product;
  onDelete: (product: Product) => void;
  onEdit: (product: Product) => void;
}

export const ProductCard = forwardRef<HTMLLIElement, ProductCardProps>(
  function ProductCard({ product, onDelete, onEdit }, ref) {
    const handleKeyDown = (event: KeyboardEvent<HTMLLIElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onEdit(product);
      }
    };

    return (
      <motion.li
        ref={ref}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.2 }}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="flex cursor-pointer flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 dark:border-neutral-800 dark:bg-neutral-900 dark:focus:ring-offset-neutral-900"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-neutral-500">
              Código #{product.codigo}
            </span>
            <h3 className="break-words text-lg font-semibold leading-tight text-slate-900 dark:text-neutral-100">
              {product.nombre}
            </h3>
          </div>
          <div className="flex shrink-0 gap-1">
            <Button
              type="button"
              variant="secondary"
              size="icon"
              onClick={(event) => {
                event.stopPropagation();
                onEdit(product);
              }}
              aria-label={`Editar ${product.nombre}`}
              title={`Editar ${product.nombre}`}
            >
              <PencilIcon />
            </Button>
            <Button
              type="button"
              variant="danger"
              size="icon"
              onClick={(event) => {
                event.stopPropagation();
                onDelete(product);
              }}
              aria-label={`Eliminar ${product.nombre}`}
              title={`Eliminar ${product.nombre}`}
            >
              <TrashIcon />
            </Button>
          </div>
        </div>

        <p className="line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-neutral-400">
          {product.descripcion}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-3 dark:border-neutral-800">
          <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
            {formatQuantity(product.cantidad)} UND
          </span>
          <time
            dateTime={product.creacion}
            className="text-xs text-slate-400 dark:text-neutral-500"
            title="Fecha de creación"
          >
            {formatDate(product.creacion)}
          </time>
        </div>
      </motion.li>
    );
  }
);
