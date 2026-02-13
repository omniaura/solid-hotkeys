import { describe, test, expect, mock } from "bun:test";
import { createRoot } from "solid-js";
import { createHotkeyRecorder, type SolidHotkeyRecorder } from "../src/createHotkeyRecorder";

describe("createHotkeyRecorder", () => {
  test("initializes with isRecording false", () => {
    const dispose = createRoot((dispose) => {
      const recorder = createHotkeyRecorder({
        onRecord: () => {},
      });

      expect(recorder.isRecording()).toBe(false);
      expect(recorder.recordedHotkey()).toBe(null);
      return dispose;
    });
    dispose();
  });

  test("starts and stops recording", () => {
    let recorder!: SolidHotkeyRecorder;

    const dispose = createRoot((dispose) => {
      recorder = createHotkeyRecorder({
        onRecord: () => {},
      });
      return dispose;
    });

    recorder.startRecording();
    expect(recorder.isRecording()).toBe(true);

    recorder.stopRecording();
    expect(recorder.isRecording()).toBe(false);

    dispose();
  });

  test("cancel recording calls onCancel", () => {
    const onCancel = mock(() => {});
    let recorder!: SolidHotkeyRecorder;

    const dispose = createRoot((dispose) => {
      recorder = createHotkeyRecorder({
        onRecord: () => {},
        onCancel,
      });
      return dispose;
    });

    recorder.startRecording();
    recorder.cancelRecording();

    expect(recorder.isRecording()).toBe(false);
    expect(onCancel).toHaveBeenCalled();

    dispose();
  });

  test("cleans up on disposal", () => {
    let recorder!: SolidHotkeyRecorder;

    const dispose = createRoot((dispose) => {
      recorder = createHotkeyRecorder({
        onRecord: () => {},
      });
      return dispose;
    });

    recorder.startRecording();
    dispose();

    // After dispose, calling methods should not throw
    expect(() => recorder.startRecording()).not.toThrow();
  });
});
