import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type {
  Product,
  ProductFormData,
  SortField,
  SortOrder,
} from "@/types/product";

export function filterAndSortProducts(
  products: Product[],
  searchTerm: string,
  sortField: SortField,
  sortOrder: SortOrder
): Product[] {
  const term = searchTerm.trim().toLowerCase();
  const result =
    term.length > 0
      ? products.filter((product) =>
          product.nombre.toLowerCase().includes(term)
        )
      : [...products];

  result.sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    let comparison: number;
    if (typeof aValue === "string" && typeof bValue === "string") {
      comparison = aValue.localeCompare(bValue, "es", {
        numeric: true,
        sensitivity: "base",
      });
    } else {
      comparison = (aValue as number) - (bValue as number);
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  return result;
}

export interface ProductState {
  products: Product[];
  searchTerm: string;
  sortField: SortField;
  sortOrder: SortOrder;
  editingProduct: Product | null;
  addProduct: (data: ProductFormData) => void;
  updateProduct: (codigo: number, data: ProductFormData) => void;
  removeProduct: (codigo: number) => void;
  setSearchTerm: (searchTerm: string) => void;
  setSortField: (sortField: SortField) => void;
  setSortOrder: (sortOrder: SortOrder) => void;
  setEditingProduct: (product: Product | null) => void;
}

export const initialProductState = {
  products: [] as Product[],
  searchTerm: "",
  sortField: "codigo" as SortField,
  sortOrder: "asc" as SortOrder,
  editingProduct: null as Product | null,
};

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      ...initialProductState,

      addProduct: (data) =>
        set((state) => {
          const normalizedName = data.nombre.trim().toLowerCase();
          const existing = state.products.find(
            (product) =>
              product.nombre.trim().toLowerCase() === normalizedName
          );

          if (existing) {
            return {
              products: state.products.map((product) =>
                product.codigo === existing.codigo
                  ? { ...product, cantidad: product.cantidad + data.cantidad }
                  : product
              ),
            };
          }

          const maxCodigo = state.products.reduce(
            (max, product) => Math.max(max, product.codigo),
            0
          );
          const product: Product = {
            ...data,
            codigo: maxCodigo + 1,
            creacion: new Date().toISOString(),
          };
          return { products: [...state.products, product] };
        }),

      removeProduct: (codigo) =>
        set((state) => ({
          products: state.products.filter((product) => product.codigo !== codigo),
          editingProduct:
            state.editingProduct?.codigo === codigo ? null : state.editingProduct,
        })),

      updateProduct: (codigo, data) =>
        set((state) => ({
          products: state.products.map((product) =>
            product.codigo === codigo
              ? { ...product, ...data }
              : product
          ),
        })),

      setSearchTerm: (searchTerm) => set({ searchTerm }),

      setSortField: (sortField) => set({ sortField }),

      setSortOrder: (sortOrder) => set({ sortOrder }),

      setEditingProduct: (editingProduct) => set({ editingProduct }),
    }),
    {
      name: "kibbo-products",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        products: state.products,
        searchTerm: state.searchTerm,
        sortField: state.sortField,
        sortOrder: state.sortOrder,
      }),
    }
  )
);
