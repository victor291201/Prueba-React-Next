import {
  filterAndSortProducts,
  initialProductState,
  useProductStore,
} from "@/store/productStore";
import type { Product } from "@/types/product";

function flushPromises(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    codigo: 1,
    nombre: "Producto",
    descripcion: "Descripción válida",
    cantidad: 10,
    creacion: "2024-06-15T10:00:00.000Z",
    ...overrides,
  };
}

beforeEach(() => {
  useProductStore.setState(initialProductState);
  localStorage.clear();
});

describe("useProductStore", () => {
  it("adds a product with auto-incremented codigo and creacion", () => {
    useProductStore.getState().addProduct({
      nombre: "Camiseta",
      descripcion: "Camiseta de algodón",
      cantidad: 5,
    });
    useProductStore.getState().addProduct({
      nombre: "Pantalón",
      descripcion: "Pantalón vaquero",
      cantidad: 3,
    });

    const { products } = useProductStore.getState();
    expect(products).toHaveLength(2);
    expect(products[0].codigo).toBe(1);
    expect(products[1].codigo).toBe(2);
    expect(products[1].creacion).toBeDefined();
    expect(Number.isNaN(new Date(products[1].creacion).getTime())).toBe(false);
  });

  it("merges quantities when adding a product with an existing name", () => {
    useProductStore.getState().addProduct({
      nombre: "Camiseta",
      descripcion: "Camiseta de algodón",
      cantidad: 5,
    });
    useProductStore.getState().addProduct({
      nombre: "  camisETA  ", // different casing and whitespace
      descripcion: "Otra descripción",
      cantidad: 10,
    });

    const { products } = useProductStore.getState();
    expect(products).toHaveLength(1);
    expect(products[0].nombre).toBe("Camiseta");
    expect(products[0].cantidad).toBe(15);
    expect(products[0].codigo).toBe(1);
  });

  it("keeps original description when merging duplicates", () => {
    useProductStore.getState().addProduct({
      nombre: "Camiseta",
      descripcion: "Camiseta de algodón",
      cantidad: 3,
    });
    useProductStore.getState().addProduct({
      nombre: "Camiseta",
      descripcion: "Esta descripción no debería sobrescribir",
      cantidad: 7,
    });

    const { products } = useProductStore.getState();
    expect(products).toHaveLength(1);
    expect(products[0].descripcion).toBe("Camiseta de algodón");
    expect(products[0].cantidad).toBe(10);
  });

  it("does not reuse codigo after deletion", () => {
    useProductStore.getState().addProduct({
      nombre: "A",
      descripcion: "Descripción A",
      cantidad: 1,
    });
    useProductStore.getState().addProduct({
      nombre: "B",
      descripcion: "Descripción B",
      cantidad: 2,
    });

    useProductStore.getState().removeProduct(1);
    useProductStore.getState().addProduct({
      nombre: "C",
      descripcion: "Descripción C",
      cantidad: 3,
    });

    const { products } = useProductStore.getState();
    expect(products.map((p) => p.codigo)).toEqual([2, 3]);
  });

  it("removes a product by codigo", () => {
    useProductStore.getState().addProduct({
      nombre: "A",
      descripcion: "Descripción A",
      cantidad: 1,
    });

    useProductStore.getState().removeProduct(1);
    expect(useProductStore.getState().products).toHaveLength(0);
  });

  it("updates a product by codigo", () => {
    useProductStore.getState().addProduct({
      nombre: "Original",
      descripcion: "Descripción original",
      cantidad: 10,
    });
    useProductStore.getState().addProduct({
      nombre: "Otro",
      descripcion: "Otro producto",
      cantidad: 5,
    });

    useProductStore.getState().updateProduct(1, {
      nombre: "Actualizado",
      descripcion: "Descripción actualizada",
      cantidad: 42,
    });

    const { products } = useProductStore.getState();
    expect(products).toHaveLength(2);
    expect(products[0]).toMatchObject({
      codigo: 1,
      nombre: "Actualizado",
      descripcion: "Descripción actualizada",
      cantidad: 42,
      creacion: products[0].creacion,
    });
    expect(products[1].nombre).toBe("Otro");
  });

  it("sets and clears editingProduct", () => {
    useProductStore.getState().addProduct({
      nombre: "Camiseta",
      descripcion: "Camiseta de algodón",
      cantidad: 5,
    });
    const product = useProductStore.getState().products[0];

    useProductStore.getState().setEditingProduct(product);
    expect(useProductStore.getState().editingProduct).toEqual(product);

    useProductStore.getState().setEditingProduct(null);
    expect(useProductStore.getState().editingProduct).toBeNull();
  });

  it("clears editingProduct when the edited product is deleted", () => {
    useProductStore.getState().addProduct({
      nombre: "Camiseta",
      descripcion: "Camiseta de algodón",
      cantidad: 5,
    });
    const product = useProductStore.getState().products[0];

    useProductStore.getState().setEditingProduct(product);
    useProductStore.getState().removeProduct(product.codigo);

    expect(useProductStore.getState().editingProduct).toBeNull();
  });
  it("does not modify products when updating a non-existent codigo", () => {
    useProductStore.getState().addProduct({
      nombre: "Original",
      descripcion: "Descripción original",
      cantidad: 10,
    });

    useProductStore.getState().updateProduct(999, {
      nombre: "Fantasma",
      descripcion: "No existe",
      cantidad: 0,
    });

    const { products } = useProductStore.getState();
    expect(products).toHaveLength(1);
    expect(products[0].nombre).toBe("Original");
  });

  it("updates searchTerm, sortField and sortOrder", () => {
    useProductStore.getState().setSearchTerm("camisa");
    useProductStore.getState().setSortField("cantidad");
    useProductStore.getState().setSortOrder("desc");

    const state = useProductStore.getState();
    expect(state.searchTerm).toBe("camisa");
    expect(state.sortField).toBe("cantidad");
    expect(state.sortOrder).toBe("desc");
  });

  it("persists products to localStorage", async () => {
    useProductStore.getState().addProduct({
      nombre: "Camiseta",
      descripcion: "Camiseta de algodón",
      cantidad: 5,
    });

    await flushPromises();

    const raw = localStorage.getItem("kibbo-products");
    expect(raw).not.toBeNull();

    const persisted = JSON.parse(raw as string) as {
      state: { products: Product[] };
    };
    expect(persisted.state.products).toHaveLength(1);
    expect(persisted.state.products[0].nombre).toBe("Camiseta");
  });

  it("does not persist actions to localStorage", async () => {
    useProductStore.getState().addProduct({
      nombre: "Camiseta",
      descripcion: "Camiseta de algodón",
      cantidad: 5,
    });

    await flushPromises();

    const persisted = JSON.parse(
      localStorage.getItem("kibbo-products") as string
    ) as { state: Record<string, unknown> };
    expect(persisted.state.addProduct).toBeUndefined();
  });
});

describe("filterAndSortProducts", () => {
  const products = [
    makeProduct({ codigo: 3, nombre: "Zapatillas", cantidad: 20 }),
    makeProduct({ codigo: 1, nombre: "Camiseta", cantidad: 5 }),
    makeProduct({ codigo: 2, nombre: "camiseta de manga", cantidad: 15 }),
  ];

  it("filters by name case-insensitively", () => {
    const result = filterAndSortProducts(products, "CAMISETA", "codigo", "asc");
    expect(result).toHaveLength(2);
  });

  it("returns all products when search term is empty", () => {
    const result = filterAndSortProducts(products, "  ", "codigo", "asc");
    expect(result).toHaveLength(3);
  });

  it("sorts by codigo ascending by default", () => {
    const result = filterAndSortProducts(products, "", "codigo", "asc");
    expect(result.map((p) => p.codigo)).toEqual([1, 2, 3]);
  });

  it("sorts by codigo descending", () => {
    const result = filterAndSortProducts(products, "", "codigo", "desc");
    expect(result.map((p) => p.codigo)).toEqual([3, 2, 1]);
  });

  it("sorts by cantidad numerically", () => {
    const result = filterAndSortProducts(products, "", "cantidad", "desc");
    expect(result.map((p) => p.cantidad)).toEqual([20, 15, 5]);
  });

  it("sorts by nombre alphabetically", () => {
    const result = filterAndSortProducts(products, "", "nombre", "asc");
    expect(result.map((p) => p.nombre)).toEqual([
      "Camiseta",
      "camiseta de manga",
      "Zapatillas",
    ]);
  });

  it("sorts by creacion chronologically", () => {
    const dated = [
      makeProduct({ codigo: 1, creacion: "2024-06-01T00:00:00.000Z" }),
      makeProduct({ codigo: 2, creacion: "2024-06-15T00:00:00.000Z" }),
    ];
    const result = filterAndSortProducts(dated, "", "creacion", "asc");
    expect(result.map((p) => p.codigo)).toEqual([1, 2]);
  });
});
