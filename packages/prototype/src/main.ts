import { Vector2 } from "@utilities/data-structures";
import { Mathematics } from "@utilities/mathematics";

const config = {
  canvasWidth: 600,
  canvasHeight: 600,
} as const;

let context: CanvasRenderingContext2D;

enum Input {
  Up = "w",
  Left = "a",
  Down = "s",
  Right = "d",
}

const currentInput = {
  [Input.Up]: false,
  [Input.Left]: false,
  [Input.Down]: false,
  [Input.Right]: false,
};

type Character = {
  position: Vector2;
  speed: number;
  color: string;
  size: number;
};

const player: Character = {
  position: Vector2.Create.zero(),
  speed: 5,
  color: "#109910",
  size: 10,
};

function setupInput() {
  window.addEventListener("keydown", (event: KeyboardEvent) => {
    const key = event.key.toLowerCase() as Input;
    if (key === Input.Up) {
      currentInput[Input.Up] = true;
    } else if (key === Input.Left) {
      currentInput[Input.Left] = true;
    } else if (key === Input.Down) {
      currentInput[Input.Down] = true;
    } else if (key === Input.Right) {
      currentInput[Input.Right] = true;
    }
  });

  window.addEventListener("keyup", (event: KeyboardEvent) => {
    const key = event.key.toLowerCase() as Input;
    if (key === Input.Up) {
      currentInput[Input.Up] = false;
    } else if (key === Input.Left) {
      currentInput[Input.Left] = false;
    } else if (key === Input.Down) {
      currentInput[Input.Down] = false;
    } else if (key === Input.Right) {
      currentInput[Input.Right] = false;
    }
  });
}

function moveCharacter(character: Character) {
  const isHorizontalMovement = currentInput[Input.Left] || currentInput[Input.Right];
  const isVerticalMovement = currentInput[Input.Up] || currentInput[Input.Down];

  if (!isHorizontalMovement && !isVerticalMovement) return;

  let speed = character.speed;
  if (isHorizontalMovement && isVerticalMovement) speed *= Mathematics.SIN_45;

  if (currentInput[Input.Up]) character.position.y -= speed;
  if (currentInput[Input.Left]) character.position.x -= speed;
  if (currentInput[Input.Down]) character.position.y += speed;
  if (currentInput[Input.Right]) character.position.x += speed;
}

function renderCharacter(character: Character) {
  const halfSize = character.size * 0.5;

  const x = character.position.x - halfSize;
  const y = character.position.y - halfSize;
  const size = character.size;

  context.fillStyle = character.color;
  context.fillRect(x, y, size, size);
}

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = config.canvasWidth;
  canvas.height = config.canvasHeight;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  return context;
}

function renderBackground() {
  context.fillStyle = "#303030";
  context.fillRect(0, 0, config.canvasWidth, config.canvasHeight);
}

export function main(canvas: HTMLCanvasElement) {
  context = setupContext(canvas);
  setupInput();

  const animation = () => {
    renderBackground();
    renderCharacter(player);
    moveCharacter(player);

    requestAnimationFrame(animation);
  };

  requestAnimationFrame(animation);
}
