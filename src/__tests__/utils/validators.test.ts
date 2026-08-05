import {
  validateNombre,
  validateDescripcion,
  validateCantidad,
  validateProduct,
  hasErrors,
} from "@/utils/validators";

describe("validateNombre", () => {
  it("returns an error when empty or only whitespace", () => {
    expect(validateNombre("")).toBe("El nombre es obligatorio.");
    expect(validateNombre("   ")).toBe("El nombre es obligatorio.");
  });

  it("returns an error when shorter than 2 characters", () => {
    expect(validateNombre("A")).toBe(
      "El nombre debe tener al menos 2 caracteres."
    );
  });

  it("returns an error when longer than 100 characters", () => {
    expect(validateNombre("x".repeat(101))).toBe(
      "El nombre no puede superar los 100 caracteres."
    );
  });

  it("accepts valid names", () => {
    expect(validateNombre("Camiseta")).toBeUndefined();
    expect(validateNombre("x".repeat(100))).toBeUndefined();
  });
});

describe("validateDescripcion", () => {
  it("returns an error when empty or only whitespace", () => {
    expect(validateDescripcion("")).toBe("La descripción es obligatoria.");
    expect(validateDescripcion("   ")).toBe("La descripción es obligatoria.");
  });

  it("returns an error when shorter than 5 characters", () => {
    expect(validateDescripcion("abcd")).toBe(
      "La descripción debe tener al menos 5 caracteres."
    );
  });

  it("returns an error when longer than 500 characters", () => {
    expect(validateDescripcion("x".repeat(501))).toBe(
      "La descripción no puede superar los 500 caracteres."
    );
  });

  it("accepts valid descriptions", () => {
    expect(validateDescripcion("Descripción válida")).toBeUndefined();
  });
});

describe("validateCantidad", () => {
  it("returns an error when empty", () => {
    expect(validateCantidad("")).toBe("La cantidad es obligatoria.");
    expect(validateCantidad("  ")).toBe("La cantidad es obligatoria.");
  });

  it("rejects non-integer values", () => {
    expect(validateCantidad("2.5")).toBe(
      "La cantidad debe ser un número entero."
    );
  });

  it("rejects negative values", () => {
    expect(validateCantidad("-1")).toBe(
      "La cantidad no puede ser negativa."
    );
  });

  it("accepts zero and positive integers", () => {
    expect(validateCantidad("0")).toBeUndefined();
    expect(validateCantidad("42")).toBeUndefined();
  });
});

describe("validateProduct", () => {
  it("collects errors for an invalid form", () => {
    const errors = validateProduct({
      nombre: "",
      descripcion: "",
      cantidad: "-3",
    });
    expect(errors.nombre).toBe("El nombre es obligatorio.");
    expect(errors.descripcion).toBe("La descripción es obligatoria.");
    expect(errors.cantidad).toBe("La cantidad no puede ser negativa.");
    expect(hasErrors(errors)).toBe(true);
  });

  it("returns no errors for a valid form", () => {
    const errors = validateProduct({
      nombre: "Camiseta",
      descripcion: "Camiseta de algodón orgánico",
      cantidad: "12",
    });
    expect(errors).toEqual({});
    expect(hasErrors(errors)).toBe(false);
  });
});
