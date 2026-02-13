import { describe, test, expect } from "bun:test";
import { createRoot } from "solid-js";
import { useDefaultHotkeysOptions, useHotkeysContext } from "../src/HotkeysProvider";

describe("HotkeysProvider", () => {
  test("useDefaultHotkeysOptions returns empty object without provider", () => {
    createRoot((dispose) => {
      const options = useDefaultHotkeysOptions();
      expect(options).toEqual({});
      dispose();
    });
  });

  test("useHotkeysContext returns null without provider", () => {
    createRoot((dispose) => {
      const context = useHotkeysContext();
      expect(context).toBe(null);
      dispose();
    });
  });
});
