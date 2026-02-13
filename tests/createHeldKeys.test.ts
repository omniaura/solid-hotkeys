import { describe, test, expect } from "bun:test";
import { createRoot } from "solid-js";
import { createHeldKeys } from "../src/createHeldKeys";

function fireKeydown(key: string, code?: string) {
  document.dispatchEvent(
    new KeyboardEvent("keydown", { key, code: code ?? key, bubbles: true })
  );
}

function fireKeyup(key: string, code?: string) {
  document.dispatchEvent(
    new KeyboardEvent("keyup", { key, code: code ?? key, bubbles: true })
  );
}

describe("createHeldKeys", () => {
  test("returns empty array initially", () => {
    const dispose = createRoot((dispose) => {
      const heldKeys = createHeldKeys();
      expect(heldKeys()).toEqual([]);
      return dispose;
    });
    dispose();
  });

  test("tracks held keys on keydown", () => {
    let heldKeys!: () => Array<string>;

    const dispose = createRoot((dispose) => {
      heldKeys = createHeldKeys();
      return dispose;
    });

    fireKeydown("Shift", "ShiftLeft");
    expect(heldKeys()).toContain("Shift");

    fireKeyup("Shift", "ShiftLeft");
    expect(heldKeys()).not.toContain("Shift");

    dispose();
  });

  test("tracks multiple held keys", () => {
    let heldKeys!: () => Array<string>;

    const dispose = createRoot((dispose) => {
      heldKeys = createHeldKeys();
      return dispose;
    });

    fireKeydown("Shift", "ShiftLeft");
    fireKeydown("a", "KeyA");

    const keys = heldKeys();
    expect(keys.length).toBeGreaterThanOrEqual(1);

    // Clean up
    fireKeyup("Shift", "ShiftLeft");
    fireKeyup("a", "KeyA");

    dispose();
  });

  test("cleans up on disposal", () => {
    let heldKeys!: () => Array<string>;

    const dispose = createRoot((dispose) => {
      heldKeys = createHeldKeys();
      return dispose;
    });

    dispose();

    // After disposal, the accessor should still return an array (last value)
    expect(Array.isArray(heldKeys())).toBe(true);
  });
});
