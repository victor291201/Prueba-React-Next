"use client";

import { useMemo } from "react";
import Image from "next/image";
import { useProducts } from "@/hooks/useProducts";
import { formatQuantity } from "@/utils/formatters";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function ProductHeader() {
  const { products } = useProducts();

  const totalUnits = useMemo(
    () => products.reduce((sum, product) => sum + product.cantidad, 0),
    [products]
  );

  return (
    <header className="border-b border-slate-200 bg-white transition-colors dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="KIBBO"
            width={36}
            height={36}
            className="h-8 w-auto rounded"
            priority
          />
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-neutral-100">
              Gestor de productos
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-sm text-slate-500 dark:text-neutral-400">
            <strong className="text-slate-700 dark:text-neutral-300">
              {products.length}
            </strong>{" "}
            {products.length === 1 ? "producto" : "productos"} ·{" "}
            <strong className="text-slate-700 dark:text-neutral-300">
              {formatQuantity(totalUnits)}
            </strong>{" "}
            unidades
          </p>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
