const config = {
  width: 600,
  height: 600,

  rows: 11,
  cols: 11,

  blockChance: 0.18,

  colors: {
    empty: "#202020",
    block: "#000000",
    player: "#AA1010",
    lines: "#AA6010",
    text: "#AAAAAA",
  },
};

let context: CanvasRenderingContext2D;

const cellSize = config.width / config.cols;

const cells: Cell[][] = [];

enum Cell {
  Empty,
  Block,
  Player,
}

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = config.width;
  canvas.height = config.height;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  context.lineWidth = 0.3;
  context.strokeStyle = config.colors.lines;

  context.font = "36px monospace";

  return context;
}

function createCells() {
  cells.length = 0;

  for (let x = 0; x < config.cols; x++) {
    cells.push([]);
    for (let y = 0; y < config.rows; y++) {
      const isBlock = Math.random() < config.blockChance;
      cells[x].push(isBlock ? Cell.Block : Cell.Empty);
    }
  }

  cells[5][5] = Cell.Player;
}

function drawCells() {
  for (let x = 0; x < config.cols; x++) {
    for (let y = 0; y < config.rows; y++) {
      switch (cells[x][y]) {
        case Cell.Empty: {
          context.fillStyle = config.colors.empty;
          break;
        }
        case Cell.Block: {
          context.fillStyle = config.colors.block;
          break;
        }
        case Cell.Player: {
          context.fillStyle = config.colors.player;
          break;
        }
      }

      context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }
}

function drawBorders() {
  context.strokeStyle = config.colors.lines;
  for (let x = 0; x < config.cols; x++) {
    for (let y = 0; y < config.rows; y++) {
      context.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }
}

export function main(canvas: HTMLCanvasElement) {
  context = setupContext(canvas);

  createCells();

  context.fillStyle = config.colors.empty;
  context.fillRect(0, 0, config.width, config.height);

  drawCells();
  drawBorders();

  context.fillStyle = config.colors.text;
  context.fillText("0", 16, 36);
}
