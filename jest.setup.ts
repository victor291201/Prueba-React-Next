import "@testing-library/jest-dom";

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

class IntersectionObserverMock {
  root = null;
  rootMargin = "";
  thresholds = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

beforeEach(() => {
  localStorage.clear();
});

Object.defineProperty(global, "ResizeObserver", {
  writable: true,
  value: ResizeObserverMock,
});

Object.defineProperty(global, "IntersectionObserver", {
  writable: true,
  value: IntersectionObserverMock,
});

if (!global.requestAnimationFrame) {
  Object.defineProperty(global, "requestAnimationFrame", {
    writable: true,
    value: (callback: FrameRequestCallback) =>
      setTimeout(() => callback(performance.now()), 0),
  });
}

if (!global.cancelAnimationFrame) {
  Object.defineProperty(global, "cancelAnimationFrame", {
    writable: true,
    value: (id: number) => clearTimeout(id),
  });
}

if (!window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}
