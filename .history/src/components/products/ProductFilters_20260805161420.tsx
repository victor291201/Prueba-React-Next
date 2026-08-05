"use client";

import { useEffect, useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@/components/ui/Input";
import { SearchIcon } from "@/components/ui/icons";
import { ProductSort } from "./ProductSort";

export function ProductFilters() {
  const { searchTerm, setSearchTerm, filteredProducts } = useProducts();
  const [query, setQuery] = useState(searchTerm);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    setSearchTerm(debouncedQuery);
  }, [debouncedQuery, setSearchTerm]);

  return (
    <section
      aria-label="Filtros y ordenamiento"
      className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-3 top-1 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            id="product-search"
            label="Buscar producto"
            placeholder="Buscar por nombre..."
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            autoComplete="off"
            className="pl-9"
          />
        </div>
        <ProductSort />
      </div>

      <p className="text-sm text-slate-500" aria-live="polite">
        {filteredProducts.length === 1
          ? "1 producto"
          : `${filteredProducts.length} productos`}{" "}
        encontrados
      </p>
    </section>
  );
}
