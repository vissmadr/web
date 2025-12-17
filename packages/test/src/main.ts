const config = {
  width: 600,
  height: 600,

  rows: 11,
  cols: 11,

  diagonal: false,

  blockChance: 0.24,

  colors: {
    empty: "#202020",
    block: "#000000",
    player: "#108080",
    lines: "#AA6010",
    text: "#AAAAAA",
  },
};

let context: CanvasRenderingContext2D;

const cellSize = config.width / config.cols;

const cells: Cell[][] = [];

const neighbors4 = [
  { x: 1, y: 0, cost: 10 },
  { x: -1, y: 0, cost: 10 },
  { x: 0, y: 1, cost: 10 },
  { x: 0, y: -1, cost: 10 },
];

const neighbors8 = [
  { x: 1, y: 0, cost: 10 },
  { x: -1, y: 0, cost: 10 },
  { x: 0, y: 1, cost: 10 },
  { x: 0, y: -1, cost: 10 },
  { x: 1, y: 1, cost: 14 },
  { x: 1, y: -1, cost: 14 },
  { x: -1, y: 1, cost: 14 },
  { x: -1, y: -1, cost: 14 },
];

enum CellType {
  Empty,
  Block,
}

type Cell = {
  x: number;
  y: number;
  distance: number;
  type: CellType;
};

function setupContext(canvas: HTMLCanvasElement) {
  canvas.width = config.width;
  canvas.height = config.height;

  const context = canvas.getContext("2d");
  if (!context) throw "Cannot get 2d context";

  context.lineWidth = 0.3;
  context.strokeStyle = config.colors.lines;

  context.font = "28px monospace";

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
        distance: -1,
        type: isBlock ? CellType.Block : CellType.Empty,
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

      if (cell.type == CellType.Empty) {
        context.fillStyle = config.colors.empty;
      } else {
        context.fillStyle = config.colors.block;
      }

      context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);

      context.fillStyle = config.colors.text;
      const text = cell.distance > -1 ? cell.distance.toString() : "";
      context.fillText(text, x * cellSize + 10, y * cellSize + 36);

      context.fillStyle = config.colors.player;
      context.fillRect(5 * cellSize, 5 * cellSize, cellSize, cellSize);
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
  const openQueue = [];
  let openPop = 0;

  cells[5][5].distance = 0;
  openQueue.push(cells[5][5]);

  while (openPop < openQueue.length) {
    const current: Cell = openQueue[openPop];
    openPop += 1;

    const neighbors = config.diagonal ? neighbors8 : neighbors4;
    for (let i = 0; i < neighbors.length; i++) {
      const nx = current.x + neighbors8[i].x;
      const ny = current.y + neighbors8[i].y;

      if (nx < 0 || ny < 0 || nx >= config.cols || ny >= config.rows) {
        continue;
      }

      const neighbor = cells[nx][ny];

      if (neighbor.type == CellType.Block) {
        continue;
      }

      if (neighbor.distance > -1) {
        continue;
      }

      neighbor.distance = current.distance + neighbors[i].cost;

      openQueue.push(neighbor);
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
