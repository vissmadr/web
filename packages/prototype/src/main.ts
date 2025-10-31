// -----------
// -- Types --
// -----------

enum Input {
  Up = "w",
  Left = "a",
  Down = "s",
  Right = "d",
}

type Vector2 = {
  x: number;
  y: number;
};

type Camera = {
  position: Vector2;
};

type Character = {
  position: Vector2;
  speed: number;
  color: string;
  size: number;
};

// ----------
// -- Data --
// ----------

const config = {
  screenWidth: 600,
  screenHeight: 600,

  enemiesCount: 2_000,
} as const;

let context: CanvasRenderingContext2D;

const currentInput = {
  [Input.Up]: false,
  [Input.Left]: false,
  [Input.Down]: false,
  [Input.Right]: false,
};

const camera: Camera = {
  position: { x: 0, y: 0 },
};

const player: Character = {
  position: { x: 0, y: 0 },
  speed: 6,
  color: "#10AA10",
  size: 15,
};

// -----------
// -- Logic --
// -----------

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = config.screenWidth;
  canvas.height = config.screenHeight;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  return context;
}

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

function renderBackground() {
  context.fillStyle = "#303030";
  context.fillRect(0, 0, config.screenWidth, config.screenHeight);
}

function renderCharacter(character: Character) {
  const halfSize = character.size * 0.5;

  const x = character.position.x - halfSize;
  const y = character.position.y - halfSize;
  const size = character.size;

  const xCameraDifference = x - camera.position.x;
  const yCameraDifference = y - camera.position.y;

  context.fillStyle = character.color;
  context.fillRect(xCameraDifference, yCameraDifference, size, size);
}

function createEnemies() {
  const enemies: Character[] = [];

  for (let i = 0; i < config.enemiesCount; i++) {
    const newEnemy: Character = {
      position: {
        x: -1000 + Math.random() * 2000,
        y: -1000 + Math.random() * 2000,
      },
      speed: 1,
      size: 5 + Math.random() * 10,
      color: `rgb(${100 + Math.random() * 155}, 10, 10)`,
    };

    enemies.push(newEnemy);
  }

  return enemies;
}

function moveCharacterByInput(character: Character) {
  const isHorizontalMovement = currentInput[Input.Left] || currentInput[Input.Right];
  const isVerticalMovement = currentInput[Input.Up] || currentInput[Input.Down];

  if (!isHorizontalMovement && !isVerticalMovement) return;

  let speed = character.speed;
  if (isHorizontalMovement && isVerticalMovement) speed *= Math.SQRT1_2;

  if (currentInput[Input.Up]) character.position.y -= speed;
  if (currentInput[Input.Left]) character.position.x -= speed;
  if (currentInput[Input.Down]) character.position.y += speed;
  if (currentInput[Input.Right]) character.position.x += speed;
}

function moveCharacterRandomly(character: Character) {
  const tau = Math.PI * 2;
  const angle = Math.random() * tau;
  const randomVelocity: Vector2 = {
    x: Math.cos(angle) * character.speed,
    y: Math.sin(angle) * character.speed,
  };

  character.position.x += randomVelocity.x;
  character.position.y += randomVelocity.y;
}

function updateCameraFollow(character: Character) {
  camera.position.x = character.position.x;
  camera.position.y = character.position.y;

  camera.position.x -= config.screenWidth * 0.5;
  camera.position.y -= config.screenHeight * 0.5;
}

export function main(canvas: HTMLCanvasElement) {
  context = setupContext(canvas);
  setupInput();

  const enemies = createEnemies();

  const animation = () => {
    renderBackground();

    // enemies
    for (const enemy of enemies) {
      moveCharacterRandomly(enemy);
      renderCharacter(enemy);
    }

    // player
    moveCharacterByInput(player);
    updateCameraFollow(player);
    renderCharacter(player);

    requestAnimationFrame(animation);
  };

  requestAnimationFrame(animation);
}
