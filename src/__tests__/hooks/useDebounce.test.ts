import { renderHook, act, waitFor } from "@testing-library/react";
import { useDebounce } from "@/hooks/useDebounce";
import { initialProductState, useProductStore } from "@/store/productStore";

beforeEach(() => {
  jest.useRealTimers();
  useProductStore.setState(initialProductState);
  localStorage.clear();
});

afterEach(() => {
  jest.useRealTimers();
});

describe("useDebounce", () => {
  it("returns the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("hello", 300));
    expect(result.current).toBe("hello");
  });

  it("updates the value after the delay", async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "first" } }
    );

    rerender({ value: "second" });
    expect(result.current).toBe("first");

    await waitFor(() => {
      expect(result.current).toBe("second");
    });
  });

  it("cancels pending updates when the value changes quickly", async () => {
    jest.useFakeTimers();

    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "a" } }
    );

    rerender({ value: "b" });
    act(() => {
      jest.advanceTimersByTime(200);
    });
    rerender({ value: "c" });
    expect(result.current).toBe("a");

    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current).toBe("c");
  });
});
