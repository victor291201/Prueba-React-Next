import { render, screen, fireEvent, act } from "@testing-library/react";
import { ProductFilters } from "@/components/products/ProductFilters";
import { initialProductState, useProductStore } from "@/store/productStore";
import type { Product } from "@/types/product";

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    codigo: 1,
    nombre: "Camiseta",
    descripcion: "Camiseta de algodón orgánico",
    cantidad: 10,
    creacion: "2024-06-15T10:00:00.000Z",
    ...overrides,
  };
}

beforeEach(() => {
  jest.useFakeTimers();
  useProductStore.setState(initialProductState);
  localStorage.clear();
});

afterEach(() => {
  jest.useRealTimers();
});

describe("ProductFilters", () => {
  it("updates the search term after the debounce delay", () => {
    render(<ProductFilters />);

    const input = screen.getByLabelText("Buscar producto");
    fireEvent.change(input, { target: { value: "camiseta" } });

    expect(useProductStore.getState().searchTerm).toBe("");

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(useProductStore.getState().searchTerm).toBe("camiseta");
  });

  it("shows the number of filtered products", () => {
    useProductStore.setState({
      products: [
        makeProduct({ codigo: 1, nombre: "Camiseta" }),
        makeProduct({ codigo: 2, nombre: "Pantalón" }),
      ],
      searchTerm: "",
      sortField: "codigo",
      sortOrder: "asc",
    });

    render(<ProductFilters />);

    expect(screen.getByText("2 productos encontrados")).toBeInTheDocument();
  });

  it("updates the sort field from the select", () => {
    render(<ProductFilters />);

    fireEvent.change(screen.getByLabelText("Ordenar por"), {
      target: { value: "cantidad" },
    });

    expect(useProductStore.getState().sortField).toBe("cantidad");
  });

  it("toggles the sort order", () => {
    render(<ProductFilters />);

    fireEvent.click(
      screen.getByRole("button", { name: /cambiar dirección/i })
    );

    expect(useProductStore.getState().sortOrder).toBe("desc");
  });
});
