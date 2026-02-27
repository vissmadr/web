import { Vector2 } from "@utilities/data-structures";
import { Config } from "./config";

export namespace Input {
  const pointerCoordinates: Vector2 = Vector2.Create.zero();

  let isPointerDown: boolean = false;
  let spawnKey: Config.SpawnKeys = Config.SpawnKeys.NONE;

  const trackedListeners: { target: EventTarget; type: string; listener: EventListener }[] = [];

  function track<K extends string>(
    target: EventTarget,
    type: K,
    listener: EventListener,
  ) {
    target.addEventListener(type, listener);
    trackedListeners.push({ target, type, listener });
  }

  export function getSpawnKey() {
    return spawnKey;
  }

  export function getPointerX() {
    return pointerCoordinates.x;
  }

  export function getPointerY() {
    return pointerCoordinates.y;
  }

  export function getIsPointerDown() {
    return isPointerDown;
  }

  export function setup(canvas: HTMLCanvasElement) {
    setupPointer(canvas);
    setupKeyboard();
  }

  export function setOnDebug(callback: () => void) {
    track(window, "keydown", ((ev: KeyboardEvent) => {
      if (ev.key.toLowerCase() === "d") callback();
    }) as EventListener);
  }

  export function cleanup() {
    for (const { target, type, listener } of trackedListeners) {
      target.removeEventListener(type, listener);
    }
    trackedListeners.length = 0;
  }

  function setupPointer(canvas: HTMLCanvasElement) {
    track(canvas, "pointermove", ((ev: PointerEvent) => {
      const canvasBounds = canvas.getBoundingClientRect();
      const x = ev.clientX - canvasBounds.left;
      const y = ev.clientY - canvasBounds.top;

      pointerCoordinates.set(x / canvas.width, (canvas.height - y) / canvas.height);
    }) as EventListener);

    track(window, "pointerdown", () => {
      isPointerDown = true;
    });
    track(window, "pointerup", () => {
      isPointerDown = false;
    });
    track(window, "blur", () => {
      isPointerDown = false;
    });
  }

  function setupKeyboard() {
    track(window, "keydown", ((ev: KeyboardEvent) => {
      switch (ev.key.toLowerCase()) {
        case "0":
          spawnKey = Config.SpawnKeys.NUM_0;
          break;
        case "1":
          spawnKey = Config.SpawnKeys.NUM_1;
          break;
        case "2":
          spawnKey = Config.SpawnKeys.NUM_2;
          break;
        case "3":
          spawnKey = Config.SpawnKeys.NUM_3;
          break;
        case "4":
          spawnKey = Config.SpawnKeys.NUM_4;
          break;
        case "5":
          spawnKey = Config.SpawnKeys.NUM_5;
          break;
        case "6":
          spawnKey = Config.SpawnKeys.NUM_6;
          break;
        case "7":
          spawnKey = Config.SpawnKeys.NUM_7;
          break;
        case "r":
          window.location.reload();
          break;
        default:
          break;
      }
    }) as EventListener);

    track(window, "keyup", ((ev: KeyboardEvent) => {
      switch (ev.key.toLowerCase()) {
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
          spawnKey = Config.SpawnKeys.NONE;
          break;
        default:
          break;
      }
    }) as EventListener);
  }
}
