import { useToastStore } from "@/store/toastStore";

beforeEach(() => {
  useToastStore.setState({ toasts: [] });
});

describe("useToastStore", () => {
  it("adds a toast with a unique id and type", () => {
    useToastStore.getState().addToast("success", "Mensaje uno");
    useToastStore.getState().addToast("error", "Mensaje dos");

    const { toasts } = useToastStore.getState();
    expect(toasts).toHaveLength(2);
    expect(toasts[0]).toMatchObject({
      type: "success",
      message: "Mensaje uno",
    });
    expect(toasts[1]).toMatchObject({
      type: "error",
      message: "Mensaje dos",
    });
    expect(toasts[0].id).not.toBe(toasts[1].id);
  });

  it("removes a toast by id", () => {
    useToastStore.getState().addToast("info", "Mensaje");
    const { id } = useToastStore.getState().toasts[0];

    useToastStore.getState().removeToast(id);

    expect(useToastStore.getState().toasts).toHaveLength(0);
  });

  it("clears all toasts", () => {
    useToastStore.getState().addToast("success", "Uno");
    useToastStore.getState().addToast("info", "Dos");

    useToastStore.getState().clearToasts();

    expect(useToastStore.getState().toasts).toHaveLength(0);
  });
});
