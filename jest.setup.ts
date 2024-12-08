import "@testing-library/jest-dom";

beforeEach(() => {
  HTMLElement.prototype.scrollIntoView = jest.fn();
  global.fetch = jest.fn();
  jest.mock("next/dynamic", () => ({
    __esModule: true,
    default: (fn: any) => {
      const Component = fn();
      return Component;
    },
  }));
});
