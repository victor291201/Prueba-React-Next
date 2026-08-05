import type { Product } from "@/types/product";
import { Button } from "@/components/ui/Button";
import { TrashIcon, PencilIcon } from "@/components/ui/icons";
import { formatDate, formatQuantity } from "@/utils/formatters";

interface ProductCardProps {
  product: Product;
  onDelete: (codigo: number) => void;
  onEdit: (product: Product) => void;
}

export function ProductCard({ product, onDelete, onEdit }: ProductCardProps) {
  return (
    <li className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Código #{product.codigo}
          </span>
          <h3 className="break-words text-lg font-semibold leading-tight text-slate-900">
            {product.nombre}
          </h3>
        </div>
        <div className="flex gap-1">
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={() => onEdit(product)}
            aria-label={`Editar ${product.nombre}`}
            title={`Editar ${product.nombre}`}
          >
            <PencilIcon />
          </Button>
          <Button
            type="button"
            variant="danger"
            size="icon"
            onClick={() => onDelete(product.codigo)}
            aria-label={`Eliminar ${product.nombre}`}
            title={`Eliminar ${product.nombre}`}
          >
            <TrashIcon />
          </Button>
        </div>
      </div>

      <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">
        {product.descripcion}
      </p>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
        <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700">
          {formatQuantity(product.cantidad)} UND
        </span>
        <time
          dateTime={product.creacion}
          className="text-xs text-slate-400"
          title="Fecha de creación"
        >
          {formatDate(product.creacion)}
        </time>
      </div>
    </li>
  );
}
