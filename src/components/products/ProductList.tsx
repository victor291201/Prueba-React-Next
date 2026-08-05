"use client";

import { useCallback, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "./ProductCard";
import { EmptyState } from "./EmptyState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { Product } from "@/types/product";

export function ProductList() {
  const { products, filteredProducts, removeProduct, setEditingProduct } =
    useProducts();
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [deletedName, setDeletedName] = useState("");

  const handleCancelDelete = useCallback(() => {
    setDeletingProduct(null);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (!deletingProduct) {
      return;
    }
    const name = deletingProduct.nombre;
    removeProduct(deletingProduct.codigo);
    setDeletingProduct(null);
    setDeletedName(`${name} eliminado.`);
    window.setTimeout(() => setDeletedName(""), 100);
  }, [deletingProduct, removeProduct]);

  if (products.length === 0) {
    return <EmptyState variant="no-products" />;
  }

  if (filteredProducts.length === 0) {
    return <EmptyState variant="no-results" />;
  }

  return (
    <>
      <ul
        aria-label="Lista de productos"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.codigo}
              product={product}
              onDelete={setDeletingProduct}
              onEdit={setEditingProduct}
            />
          ))}
        </AnimatePresence>
      </ul>

      <ConfirmDialog
        open={deletingProduct !== null}
        title="Eliminar producto"
        message={`¿Estás seguro de que deseas eliminar "${deletingProduct?.nombre}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={handleCancelDelete}
      />

      <div aria-live="assertive" className="sr-only">
        {deletedName}
      </div>
    </>
  );
}
