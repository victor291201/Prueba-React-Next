import { useMemo } from "react";
import {
  filterAndSortProducts,
  useProductStore,
} from "@/store/productStore";

export function useProducts() {
  const products = useProductStore((state) => state.products);
  const searchTerm = useProductStore((state) => state.searchTerm);
  const sortField = useProductStore((state) => state.sortField);
  const sortOrder = useProductStore((state) => state.sortOrder);
  const editingProduct = useProductStore((state) => state.editingProduct);

  const addProduct = useProductStore((state) => state.addProduct);
  const updateProduct = useProductStore((state) => state.updateProduct);
  const removeProduct = useProductStore((state) => state.removeProduct);
  const setSearchTerm = useProductStore((state) => state.setSearchTerm);
  const setSortField = useProductStore((state) => state.setSortField);
  const setSortOrder = useProductStore((state) => state.setSortOrder);
  const setEditingProduct = useProductStore((state) => state.setEditingProduct);

  const filteredProducts = useMemo(
    () => filterAndSortProducts(products, searchTerm, sortField, sortOrder),
    [products, searchTerm, sortField, sortOrder]
  );

  return {
    products,
    filteredProducts,
    searchTerm,
    sortField,
    sortOrder,
    editingProduct,
    addProduct,
    updateProduct,
    removeProduct,
    setSearchTerm,
    setSortField,
    setSortOrder,
    setEditingProduct,
  };
}
