export interface Product {
  codigo: number;
  nombre: string;
  descripcion: string;
  cantidad: number;
  creacion: string;
}

export interface ProductFormValues {
  nombre: string;
  descripcion: string;
  cantidad: string;
}

export type ProductFormData = Omit<Product, "codigo" | "creacion">;

export type SortField = "codigo" | "nombre" | "cantidad" | "creacion";

export type SortOrder = "asc" | "desc";
