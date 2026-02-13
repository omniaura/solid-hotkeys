import { describe, test, expect } from "bun:test";
import { createRoot } from "solid-js";
import { createHeldKeyCodes } from "../src/createHeldKeyCodes";

function fireKeydown(key: string, code: string) {
  document.dispatchEvent(
    new KeyboardEvent("keydown", { key, code, bubbles: true })
  );
}

function fireKeyup(key: string, code: string) {
  document.dispatchEvent(
    new KeyboardEvent("keyup", { key, code, bubbles: true })
  );
}

describe("createHeldKeyCodes", () => {
  test("returns empty object initially", () => {
    const dispose = createRoot((dispose) => {
      const heldCodes = createHeldKeyCodes();
      expect(heldCodes()).toEqual({});
      return dispose;
    });
    dispose();
  });

  test("tracks key codes on keydown", () => {
    let heldCodes!: () => Record<string, string>;

    const dispose = createRoot((dispose) => {
      heldCodes = createHeldKeyCodes();
      return dispose;
    });

    fireKeydown("Shift", "ShiftLeft");
    expect(heldCodes()["Shift"]).toBe("ShiftLeft");

    fireKeyup("Shift", "ShiftLeft");
    expect(heldCodes()["Shift"]).toBeUndefined();

    dispose();
  });

  test("distinguishes left vs right modifier", () => {
    let heldCodes!: () => Record<string, string>;

    const dispose = createRoot((dispose) => {
      heldCodes = createHeldKeyCodes();
      return dispose;
    });

    fireKeydown("Shift", "ShiftLeft");
    expect(heldCodes()["Shift"]).toBe("ShiftLeft");
    fireKeyup("Shift", "ShiftLeft");

    fireKeydown("Shift", "ShiftRight");
    expect(heldCodes()["Shift"]).toBe("ShiftRight");
    fireKeyup("Shift", "ShiftRight");

    dispose();
  });
});
