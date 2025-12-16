const config = {
  width: 600,
  height: 600,

  rows: 11,
  cols: 11,

  blockChance: 0.22,

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

const Neighbors = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
];

enum CellType {
  Empty,
  Block,
}

type Cell = {
  x: number;
  y: number;
  type: CellType;
  isReached: boolean;
};

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
      const newCell: Cell = {
        x: x,
        y: y,
        type: isBlock ? CellType.Block : CellType.Empty,
        isReached: false,
      };
      cells[x].push(newCell);
    }
  }

  cells[5][5].type = CellType.Empty;
}

function drawCells() {
  for (let x = 0; x < config.cols; x++) {
    for (let y = 0; y < config.rows; y++) {
      const cell = cells[x][y];

      switch (cell.type) {
        case CellType.Empty: {
          context.fillStyle = config.colors.empty;
          break;
        }
        case CellType.Block: {
          context.fillStyle = config.colors.block;
          break;
        }
      }

      context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);

      context.fillStyle = config.colors.text;
      const text = cell.isReached ? "R" : "";
      context.fillText(text, x * cellSize + 16, y * cellSize + 40);
    }
  }
}

function drawBackground() {
  context.fillStyle = config.colors.empty;
  context.fillRect(0, 0, config.width, config.height);
}

function drawBorders() {
  context.strokeStyle = config.colors.lines;
  for (let x = 0; x < config.cols; x++) {
    for (let y = 0; y < config.rows; y++) {
      context.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }
}

function algorithm() {
  const open = [];
  let openPop = 0;

  open.push(cells[5][5]);

  while (openPop < open.length) {
    const current: Cell = open[openPop];
    openPop += 1;

    for (let i = 0; i < Neighbors.length; i++) {
      const nx = current.x + Neighbors[i].x;
      const ny = current.y + Neighbors[i].y;

      if (nx < 0 || ny < 0 || nx >= config.cols || ny >= config.rows) {
        continue;
      }

      const neighbor = cells[nx][ny];

      if (neighbor.type == CellType.Block) {
        continue;
      }

      if (neighbor.isReached) {
        continue;
      }

      neighbor.isReached = true;

      open.push(neighbor);
    }
  }
}

export function main(canvas: HTMLCanvasElement) {
  context = setupContext(canvas);

  createCells();

  algorithm();

  drawBackground();
  drawCells();
  drawBorders();
}
