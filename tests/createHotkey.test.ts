import { describe, test, expect, mock } from "bun:test";
import { createRoot, createSignal } from "solid-js";
import { createHotkey } from "../src/createHotkey";

function fireKeydown(
  key: string,
  opts: Partial<KeyboardEvent> = {},
  target: EventTarget = document
) {
  target.dispatchEvent(
    new KeyboardEvent("keydown", { key, bubbles: true, ...opts })
  );
}

describe("createHotkey", () => {
  test("calls callback when hotkey is pressed", () => {
    const fn = mock(() => {});

    const dispose = createRoot((dispose) => {
      createHotkey("Escape", fn);
      return dispose;
    });

    fireKeydown("Escape");
    expect(fn).toHaveBeenCalledTimes(1);
    dispose();
  });

  test("does not call callback for non-matching key", () => {
    const fn = mock(() => {});

    const dispose = createRoot((dispose) => {
      createHotkey("Escape", fn);
      return dispose;
    });

    fireKeydown("Enter");
    expect(fn).not.toHaveBeenCalled();
    dispose();
  });

  test("unregisters on disposal", () => {
    const fn = mock(() => {});

    const dispose = createRoot((dispose) => {
      createHotkey("Escape", fn);
      return dispose;
    });

    dispose();
    fireKeydown("Escape");
    expect(fn).not.toHaveBeenCalled();
  });

  test("supports modifier keys", () => {
    const fn = mock(() => {});

    const dispose = createRoot((dispose) => {
      createHotkey("Shift+A", fn);
      return dispose;
    });

    fireKeydown("a", { shiftKey: true });
    expect(fn).toHaveBeenCalledTimes(1);

    // Without shift should not trigger
    fireKeydown("a");
    expect(fn).toHaveBeenCalledTimes(1);

    dispose();
  });

  test("respects enabled option", () => {
    const fn = mock(() => {});

    const dispose = createRoot((dispose) => {
      createHotkey("Escape", fn, { enabled: false });
      return dispose;
    });

    fireKeydown("Escape");
    expect(fn).not.toHaveBeenCalled();
    dispose();
  });

  test("accepts reactive hotkey accessor", () => {
    const fn = mock(() => {});
    let setKey!: (k: string) => void;

    const dispose = createRoot((dispose) => {
      const [key, _setKey] = createSignal("Escape");
      setKey = _setKey;
      createHotkey(key, fn);
      return dispose;
    });

    fireKeydown("Escape");
    expect(fn).toHaveBeenCalledTimes(1);

    setKey("Enter");

    // Old key should no longer fire
    fireKeydown("Escape");
    expect(fn).toHaveBeenCalledTimes(1);

    // New key should fire
    fireKeydown("Enter");
    expect(fn).toHaveBeenCalledTimes(2);

    dispose();
  });

  test("accepts reactive options accessor", () => {
    const fn = mock(() => {});
    let setEnabled!: (v: boolean) => void;

    const dispose = createRoot((dispose) => {
      const [enabled, _setEnabled] = createSignal(true);
      setEnabled = _setEnabled;
      createHotkey("Escape", fn, () => ({ enabled: enabled() }));
      return dispose;
    });

    fireKeydown("Escape");
    expect(fn).toHaveBeenCalledTimes(1);

    setEnabled(false);

    fireKeydown("Escape");
    expect(fn).toHaveBeenCalledTimes(1);

    dispose();
  });

  test("scoped to specific element target", () => {
    const fn = mock(() => {});
    const el = document.createElement("div");
    document.body.appendChild(el);

    const dispose = createRoot((dispose) => {
      createHotkey("Escape", fn, { target: el });
      return dispose;
    });

    // Firing on document should not trigger
    fireKeydown("Escape", {}, document);
    expect(fn).not.toHaveBeenCalled();

    // Firing on the element should trigger
    fireKeydown("Escape", {}, el);
    expect(fn).toHaveBeenCalledTimes(1);

    dispose();
    document.body.removeChild(el);
  });
});
