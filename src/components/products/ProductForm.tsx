"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useProducts } from "@/hooks/useProducts";
import { useToast } from "@/hooks/useToast";
import { hasErrors, validateProduct } from "@/utils/validators";
import type { ProductFormErrors } from "@/utils/validators";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";

const initialForm = {
  nombre: "",
  descripcion: "",
  cantidad: "",
};

export function ProductForm() {
  const { editingProduct, products, addProduct, updateProduct, setEditingProduct } =
    useProducts();
  const toast = useToast();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<ProductFormErrors>({});

  const isEditing = editingProduct !== null;

  useEffect(() => {
    if (editingProduct) {
      setForm({
        nombre: editingProduct.nombre,
        descripcion: editingProduct.descripcion,
        cantidad: String(editingProduct.cantidad),
      });
      setErrors({});

      const timer = setTimeout(() => {
        document.getElementById("nombre")?.focus();
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [editingProduct]);

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateProduct(form);

    if (isEditing) {
      const normalizedName = form.nombre.trim().toLowerCase();
      const nameCollides = products.some(
        (product) =>
          product.codigo !== editingProduct.codigo &&
          product.nombre.trim().toLowerCase() === normalizedName
      );
      if (nameCollides) {
        nextErrors.nombre = "Ya existe otro producto con este nombre.";
      }
    }

    setErrors(nextErrors);

    if (hasErrors(nextErrors)) {
      return;
    }

    const data = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      cantidad: Number(form.cantidad),
    };

    if (isEditing) {
      updateProduct(editingProduct.codigo, data);
      setEditingProduct(null);
      toast.success("Producto actualizado correctamente.");
    } else {
      const normalizedName = form.nombre.trim().toLowerCase();
      const alreadyExists = products.some(
        (product) =>
          product.nombre.trim().toLowerCase() === normalizedName
      );

      addProduct(data);

      if (alreadyExists) {
        toast.info("El producto ya existía. Se han sumado las cantidades.");
      } else {
        toast.success("Producto agregado correctamente.");
      }
    }

    setForm(initialForm);
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setForm(initialForm);
    setErrors({});
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label={
        isEditing
          ? "Formulario de edición de producto"
          : "Formulario de nuevo producto"
      }
      className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-colors lg:sticky lg:top-6 dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-neutral-100">
          {isEditing ? "Editar producto" : "Nuevo producto"}
        </h2>
        <p className="text-sm text-slate-500 dark:text-neutral-400">
          {isEditing
            ? `Modifica los datos del producto código #${editingProduct?.codigo}.`
            : "Completa los datos para agregar un producto al inventario."}
        </p>
      </div>

      <Input
        id="nombre"
        name="nombre"
        label="Nombre"
        placeholder="Ej. Camiseta de algodón"
        value={form.nombre}
        onChange={handleChange}
        error={errors.nombre}
        maxLength={100}
        autoComplete="off"
        aria-required="true"
      />

      <TextArea
        id="descripcion"
        name="descripcion"
        label="Descripción"
        placeholder="Breve descripción del producto"
        value={form.descripcion}
        onChange={handleChange}
        error={errors.descripcion}
        maxLength={500}
        aria-required="true"
      />

      <Input
        id="cantidad"
        name="cantidad"
        label="Cantidad"
        type="number"
        inputMode="numeric"
        min={0}
        step={1}
        placeholder="0"
        value={form.cantidad}
        onChange={handleChange}
        error={errors.cantidad}
        aria-required="true"
      />

      <div className="flex gap-2">
        <Button type="submit">
          {isEditing ? "Guardar cambios" : "Agregar producto"}
        </Button>
        {isEditing ? (
          <Button type="button" variant="secondary" onClick={handleCancel}>
            Cancelar
          </Button>
        ) : null}
      </div>
    </form>
  );
}
