import { Vector2 } from "@utilities/data-structures";
import { Config } from "./config";

export namespace Input {
  const pointerCoordinates: Vector2 = Vector2.Create.zero();

  let isPointerDown: boolean = false;
  let spawnKey: Config.SpawnKeys = Config.SpawnKeys.NONE;

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
    window.addEventListener("keydown", (ev: KeyboardEvent) => {
      if (ev.key.toLowerCase() === "d") callback();
    });
  }

  function setupPointer(canvas: HTMLCanvasElement) {
    canvas.addEventListener("pointermove", (ev: PointerEvent) => {
      const canvasBounds = canvas.getBoundingClientRect();
      const x = ev.clientX - canvasBounds.left;
      const y = ev.clientY - canvasBounds.top;

      pointerCoordinates.set(x / canvas.width, (canvas.height - y) / canvas.height);
    });

    window.addEventListener("pointerdown", () => {
      isPointerDown = true;
    });
    window.addEventListener("pointerup", () => {
      isPointerDown = false;
    });
    window.addEventListener("blur", () => {
      isPointerDown = false;
    });
  }

  function setupKeyboard() {
    window.addEventListener("keydown", (ev: KeyboardEvent) => {
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
    });

    window.addEventListener("keyup", (ev: KeyboardEvent) => {
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
    });
  }
}
