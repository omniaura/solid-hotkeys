import { describe, test, expect } from "bun:test";
import { createRoot, createSignal } from "solid-js";
import { createKeyHold } from "../src/createKeyHold";

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

describe("createKeyHold", () => {
  test("returns false initially", () => {
    const dispose = createRoot((dispose) => {
      const isShiftHeld = createKeyHold("Shift");
      expect(isShiftHeld()).toBe(false);
      return dispose;
    });
    dispose();
  });

  test("returns true when key is held", () => {
    let isShiftHeld!: () => boolean;

    const dispose = createRoot((dispose) => {
      isShiftHeld = createKeyHold("Shift");
      return dispose;
    });

    fireKeydown("Shift", "ShiftLeft");
    expect(isShiftHeld()).toBe(true);

    fireKeyup("Shift", "ShiftLeft");
    expect(isShiftHeld()).toBe(false);

    dispose();
  });

  test("is case-insensitive", () => {
    let isHeld!: () => boolean;

    const dispose = createRoot((dispose) => {
      isHeld = createKeyHold("shift");
      return dispose;
    });

    fireKeydown("Shift", "ShiftLeft");
    expect(isHeld()).toBe(true);

    fireKeyup("Shift", "ShiftLeft");
    dispose();
  });

  test("accepts reactive key accessor", () => {
    let isHeld!: () => boolean;

    const dispose = createRoot((dispose) => {
      const [key] = createSignal<string>("Shift");
      isHeld = createKeyHold(key);
      return dispose;
    });

    fireKeydown("Shift", "ShiftLeft");
    expect(isHeld()).toBe(true);
    fireKeyup("Shift", "ShiftLeft");

    dispose();
  });
});
