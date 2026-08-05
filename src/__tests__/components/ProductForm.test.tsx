import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductForm } from "@/components/products/ProductForm";
import { initialProductState, useProductStore } from "@/store/productStore";
import { useToastStore } from "@/store/toastStore";

beforeEach(() => {
  useProductStore.setState(initialProductState);
  useToastStore.setState({ toasts: [] });
  localStorage.clear();
});

describe("ProductForm", () => {
  describe("create mode", () => {
    it("shows validation errors when submitting an empty form", async () => {
      const user = userEvent.setup();
      render(<ProductForm />);

      await user.click(
        screen.getByRole("button", { name: /agregar producto/i })
      );

      expect(
        screen.getByText("El nombre es obligatorio.")
      ).toBeInTheDocument();
      expect(
        screen.getByText("La descripción es obligatoria.")
      ).toBeInTheDocument();
      expect(
        screen.getByText("La cantidad es obligatoria.")
      ).toBeInTheDocument();
    });

    it("creates a product when the form is valid", async () => {
      const user = userEvent.setup();
      render(<ProductForm />);

      await user.type(screen.getByLabelText("Nombre"), "Camiseta");
      await user.type(
        screen.getByLabelText("Descripción"),
        "Camiseta de algodón orgánico"
      );
      await user.type(screen.getByLabelText("Cantidad"), "12");
      await user.click(
        screen.getByRole("button", { name: /agregar producto/i })
      );

      const product = useProductStore.getState().products[0];
      expect(useProductStore.getState().products).toHaveLength(1);
      expect(product.nombre).toBe("Camiseta");
      expect(product.descripcion).toBe("Camiseta de algodón orgánico");
      expect(product.cantidad).toBe(12);
      expect(product.codigo).toBe(1);

      const toasts = useToastStore.getState().toasts;
      expect(toasts).toHaveLength(1);
      expect(toasts[0].message).toBe("Producto agregado correctamente.");
      expect(toasts[0].type).toBe("success");
    });

    it("merges quantities when adding an existing product name", async () => {
      const user = userEvent.setup();
      useProductStore.getState().addProduct({
        nombre: "Camiseta",
        descripcion: "Camiseta de algodón orgánico",
        cantidad: 5,
      });

      render(<ProductForm />);

      await user.type(screen.getByLabelText("Nombre"), "  camisETA  ");
      await user.type(
        screen.getByLabelText("Descripción"),
        "Otra descripción"
      );
      await user.type(screen.getByLabelText("Cantidad"), "10");
      await user.click(
        screen.getByRole("button", { name: /agregar producto/i })
      );

      const { products } = useProductStore.getState();
      expect(products).toHaveLength(1);
      expect(products[0].nombre).toBe("Camiseta");
      expect(products[0].cantidad).toBe(15);
      expect(products[0].descripcion).toBe("Camiseta de algodón orgánico");

      const toasts = useToastStore.getState().toasts;
      expect(toasts).toHaveLength(1);
      expect(toasts[0].message).toBe(
        "El producto ya existía. Se han sumado las cantidades."
      );
      expect(toasts[0].type).toBe("info");
    });

    it("resets the form after a successful submission", async () => {
      const user = userEvent.setup();
      render(<ProductForm />);

      await user.type(screen.getByLabelText("Nombre"), "Camiseta");
      await user.type(
        screen.getByLabelText("Descripción"),
        "Camiseta de algodón orgánico"
      );
      await user.type(screen.getByLabelText("Cantidad"), "12");
      await user.click(
        screen.getByRole("button", { name: /agregar producto/i })
      );

      expect(screen.getByLabelText("Nombre")).toHaveValue("");
      expect(screen.getByLabelText("Descripción")).toHaveValue("");
      expect(screen.getByLabelText("Cantidad")).toHaveValue(null);
    });
  });

  describe("edit mode", () => {
    it("populates the form when editingProduct is set", () => {
      useProductStore.setState({
        ...initialProductState,
        editingProduct: {
          codigo: 5,
          nombre: "Pantalón",
          descripcion: "Pantalón vaquero azul",
          cantidad: 20,
          creacion: "2024-08-01T10:00:00.000Z",
        },
      });

      render(<ProductForm />);

      expect(screen.getByLabelText("Nombre")).toHaveValue("Pantalón");
      expect(screen.getByLabelText("Descripción")).toHaveValue(
        "Pantalón vaquero azul"
      );
      expect(screen.getByLabelText("Cantidad")).toHaveValue(20);
    });

    it("shows edit UI with save and cancel buttons", () => {
      useProductStore.setState({
        ...initialProductState,
        editingProduct: {
          codigo: 5,
          nombre: "Pantalón",
          descripcion: "Pantalón vaquero azul",
          cantidad: 20,
          creacion: "2024-08-01T10:00:00.000Z",
        },
      });

      render(<ProductForm />);

      expect(screen.getByText("Editar producto")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /guardar cambios/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /cancelar/i })
      ).toBeInTheDocument();
    });

    it("updates the product on save and resets to create mode", async () => {
      const user = userEvent.setup();
      useProductStore.setState({
        products: [
          {
            codigo: 5,
            nombre: "Pantalón",
            descripcion: "Pantalón vaquero azul",
            cantidad: 20,
            creacion: "2024-08-01T10:00:00.000Z",
          },
        ],
        editingProduct: {
          codigo: 5,
          nombre: "Pantalón",
          descripcion: "Pantalón vaquero azul",
          cantidad: 20,
          creacion: "2024-08-01T10:00:00.000Z",
        },
        searchTerm: "",
        sortField: "codigo",
        sortOrder: "asc",
      });

      render(<ProductForm />);

      const nombreInput = screen.getByLabelText("Nombre");
      await user.clear(nombreInput);
      await user.type(nombreInput, "Pantalón actualizado");

      await user.click(
        screen.getByRole("button", { name: /guardar cambios/i })
      );

      const products = useProductStore.getState().products;
      expect(products).toHaveLength(1);
      expect(products[0].nombre).toBe("Pantalón actualizado");

      const toasts = useToastStore.getState().toasts;
      expect(toasts).toHaveLength(1);
      expect(toasts[0].message).toBe("Producto actualizado correctamente.");
      expect(screen.getByText("Nuevo producto")).toBeInTheDocument();
    });

    it("cancels editing and resets the form", async () => {
      const user = userEvent.setup();
      useProductStore.setState({
        ...initialProductState,
        editingProduct: {
          codigo: 5,
          nombre: "Pantalón",
          descripcion: "Pantalón vaquero azul",
          cantidad: 20,
          creacion: "2024-08-01T10:00:00.000Z",
        },
      });

      render(<ProductForm />);

      await user.click(
        screen.getByRole("button", { name: /cancelar/i })
      );

      expect(useProductStore.getState().editingProduct).toBeNull();
      expect(screen.getByLabelText("Nombre")).toHaveValue("");
      expect(screen.getByText("Nuevo producto")).toBeInTheDocument();
    });

    it("rejects editing when the name collides with another product", async () => {
      const user = userEvent.setup();
      useProductStore.setState({
        products: [
          {
            codigo: 1,
            nombre: "Camiseta",
            descripcion: "Camiseta de algodón",
            cantidad: 10,
            creacion: "2024-08-01T10:00:00.000Z",
          },
          {
            codigo: 2,
            nombre: "Pantalón",
            descripcion: "Pantalón vaquero azul",
            cantidad: 5,
            creacion: "2024-08-01T10:00:00.000Z",
          },
        ],
        editingProduct: {
          codigo: 2,
          nombre: "Pantalón",
          descripcion: "Pantalón vaquero azul",
          cantidad: 5,
          creacion: "2024-08-01T10:00:00.000Z",
        },
        searchTerm: "",
        sortField: "codigo",
        sortOrder: "asc",
      });

      render(<ProductForm />);

      const nombreInput = screen.getByLabelText("Nombre");
      await user.clear(nombreInput);
      await user.type(nombreInput, "  CamisETA  ");

      await user.click(
        screen.getByRole("button", { name: /guardar cambios/i })
      );

      expect(
        screen.getByText("Ya existe otro producto con este nombre.")
      ).toBeInTheDocument();
      expect(useProductStore.getState().products).toHaveLength(2);
    });
  });
});
