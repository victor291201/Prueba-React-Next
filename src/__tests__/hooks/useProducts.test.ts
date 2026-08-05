import { renderHook, act } from "@testing-library/react";
import { useProducts } from "@/hooks/useProducts";
import { initialProductState, useProductStore } from "@/store/productStore";

beforeEach(() => {
  useProductStore.setState(initialProductState);
  localStorage.clear();
});

describe("useProducts", () => {
  it("exposes the store state and actions", () => {
    const { result } = renderHook(() => useProducts());

    expect(result.current.products).toEqual([]);
    expect(result.current.searchTerm).toBe("");
    expect(result.current.sortField).toBe("codigo");
    expect(result.current.sortOrder).toBe("asc");
    expect(typeof result.current.addProduct).toBe("function");
    expect(typeof result.current.removeProduct).toBe("function");
  });

  it("computes filtered and sorted products", () => {
    useProductStore.getState().setSearchTerm("cam");
    useProductStore.getState().addProduct({
      nombre: "Zapatillas",
      descripcion: "Zapatillas deportivas",
      cantidad: 8,
    });
    useProductStore.getState().addProduct({
      nombre: "Camiseta",
      descripcion: "Camiseta de algodón",
      cantidad: 3,
    });

    const { result } = renderHook(() => useProducts());
    expect(result.current.filteredProducts.map((p) => p.nombre)).toEqual([
      "Camiseta",
    ]);
  });

  it("reacts to state changes from actions", () => {
    const { result } = renderHook(() => useProducts());

    act(() => {
      result.current.addProduct({
        nombre: "Camiseta",
        descripcion: "Camiseta de algodón",
        cantidad: 5,
      });
    });

    expect(result.current.products).toHaveLength(1);
    expect(result.current.filteredProducts).toHaveLength(1);

    act(() => {
      result.current.removeProduct(result.current.products[0].codigo);
    });

    expect(result.current.products).toHaveLength(0);
  });
});
