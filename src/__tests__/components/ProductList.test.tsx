import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductList } from "@/components/products/ProductList";
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
  useProductStore.setState(initialProductState);
  localStorage.clear();
});

describe("ProductList", () => {
  it("shows the empty state when there are no products", () => {
    render(<ProductList />);
    expect(screen.getByText("Aún no hay productos")).toBeInTheDocument();
  });

  it("shows the no-results state when the filter matches nothing", () => {
    useProductStore.setState({
      products: [makeProduct()],
      searchTerm: "no-existe",
      sortField: "codigo",
      sortOrder: "asc",
    });
    render(<ProductList />);
    expect(
      screen.getByText("No hay resultados para tu búsqueda")
    ).toBeInTheDocument();
  });

  it("renders the filtered products", () => {
    useProductStore.setState({
      products: [
        makeProduct({ codigo: 1, nombre: "Camiseta", cantidad: 10 }),
        makeProduct({ codigo: 2, nombre: "Pantalón", cantidad: 3 }),
      ],
      searchTerm: "",
      sortField: "codigo",
      sortOrder: "asc",
    });
    render(<ProductList />);

    expect(screen.getByText("Camiseta")).toBeInTheDocument();
    expect(screen.getByText("Pantalón")).toBeInTheDocument();
  });

  it("opens a confirmation dialog before deleting", async () => {
    const user = userEvent.setup();
    useProductStore.setState({
      products: [makeProduct({ codigo: 1, nombre: "Camiseta" })],
      searchTerm: "",
      sortField: "codigo",
      sortOrder: "asc",
    });

    render(<ProductList />);

    await user.click(
      screen.getByRole("button", { name: /eliminar camiseta/i })
    );

    expect(useProductStore.getState().products).toHaveLength(1);
    expect(
      screen.getByRole("alertdialog", { name: "Eliminar producto" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/¿Estás seguro de que deseas eliminar "Camiseta"/)
    ).toBeInTheDocument();
  });

  it("deletes a product only after confirming in the dialog", async () => {
    const user = userEvent.setup();
    useProductStore.setState({
      products: [
        makeProduct({ codigo: 1, nombre: "Camiseta" }),
        makeProduct({ codigo: 2, nombre: "Pantalón" }),
      ],
      searchTerm: "",
      sortField: "codigo",
      sortOrder: "asc",
    });

    render(<ProductList />);

    await user.click(
      screen.getByRole("button", { name: /eliminar camiseta/i })
    );

    await user.click(
      screen.getByRole("button", { name: "Eliminar" })
    );

    const remaining = useProductStore.getState().products;
    expect(remaining).toHaveLength(1);
    expect(remaining[0].nombre).toBe("Pantalón");
  });

  it("keeps the product when canceling the dialog", async () => {
    const user = userEvent.setup();
    useProductStore.setState({
      products: [makeProduct({ codigo: 1, nombre: "Camiseta" })],
      searchTerm: "",
      sortField: "codigo",
      sortOrder: "asc",
    });

    render(<ProductList />);

    await user.click(
      screen.getByRole("button", { name: /eliminar camiseta/i })
    );
    await user.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(useProductStore.getState().products).toHaveLength(1);
    await waitForElementToBeRemoved(() => screen.queryByRole("alertdialog"));
  });

  it("sets editingProduct when the edit button is clicked", async () => {
    const user = userEvent.setup();
    const product = makeProduct({ codigo: 1, nombre: "Camiseta" });
    useProductStore.setState({
      products: [product],
      searchTerm: "",
      sortField: "codigo",
      sortOrder: "asc",
    });

    render(<ProductList />);

    await user.click(
      screen.getByRole("button", { name: /editar camiseta/i })
    );

    expect(useProductStore.getState().editingProduct).toEqual(product);
  });
});
