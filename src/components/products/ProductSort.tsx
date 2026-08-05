"use client";

import type { SortField } from "@/types/product";
import { useProducts } from "@/hooks/useProducts";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ArrowUpDownIcon } from "@/components/ui/icons";

export function ProductSort() {
  const { sortField, sortOrder, setSortField, setSortOrder } = useProducts();

  const handleFieldChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortField(event.target.value as SortField);
  };

  const handleOrderToggle = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const orderLabel = sortOrder === "asc" ? "Ascendente" : "Descendente";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <Select
        id="sort-field"
        label="Ordenar por"
        value={sortField}
        onChange={handleFieldChange}
      >
        <option value="codigo">Código</option>
        <option value="nombre">Nombre</option>
        <option value="cantidad">Cantidad</option>
        <option value="creacion">Fecha de creación</option>
      </Select>

      <Button
        type="button"
        variant="secondary"
        onClick={handleOrderToggle}
        aria-label={`Cambiar dirección del orden, actualmente ${orderLabel.toLowerCase()}`}
        title={`Dirección: ${orderLabel}`}
      >
        <ArrowUpDownIcon
          className={`h-4 w-4 transition-transform ${
            sortOrder === "desc" ? "rotate-180" : ""
          }`}
        />
        {orderLabel}
      </Button>
    </div>
  );
}
