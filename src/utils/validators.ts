import type { ProductFormValues } from "@/types/product";

export interface ProductFormErrors {
  nombre?: string;
  descripcion?: string;
  cantidad?: string;
}

export function validateNombre(nombre: string): string | undefined {
  const trimmed = nombre.trim();
  if (trimmed.length === 0) {
    return "El nombre es obligatorio.";
  }
  if (trimmed.length < 2) {
    return "El nombre debe tener al menos 2 caracteres.";
  }
  if (trimmed.length > 100) {
    return "El nombre no puede superar los 100 caracteres.";
  }
  return undefined;
}

export function validateDescripcion(descripcion: string): string | undefined {
  const trimmed = descripcion.trim();
  if (trimmed.length === 0) {
    return "La descripción es obligatoria.";
  }
  if (trimmed.length < 5) {
    return "La descripción debe tener al menos 5 caracteres.";
  }
  if (trimmed.length > 500) {
    return "La descripción no puede superar los 500 caracteres.";
  }
  return undefined;
}

export function validateCantidad(cantidad: string): string | undefined {
  const trimmed = cantidad.trim();
  if (trimmed.length === 0) {
    return "La cantidad es obligatoria.";
  }
  const value = Number(trimmed);
  if (!Number.isInteger(value)) {
    return "La cantidad debe ser un número entero.";
  }
  if (value < 0) {
    return "La cantidad no puede ser negativa.";
  }
  return undefined;
}

export function validateProduct(values: ProductFormValues): ProductFormErrors {
  return {
    nombre: validateNombre(values.nombre),
    descripcion: validateDescripcion(values.descripcion),
    cantidad: validateCantidad(values.cantidad),
  };
}

export function hasErrors(errors: ProductFormErrors): boolean {
  return Boolean(errors.nombre || errors.descripcion || errors.cantidad);
}
