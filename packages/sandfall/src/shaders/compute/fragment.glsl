#version 300 es
precision highp int;
precision highp float;
precision highp isampler2D;

// ----------
// -- Data --
// ----------

in vec2 v_coordinates;

layout(location = 0) out ivec4 output0;
layout(location = 1) out ivec4 output1;
layout(location = 2) out ivec4 output2;

uniform isampler2D u_inputTexture0;
uniform isampler2D u_inputTexture1;
uniform isampler2D u_inputTexture2;

uniform bool u_isPointerDown;
uniform int u_time;
uniform int u_random;
uniform int u_inputKey;
uniform int u_maxSoakedCells;
uniform int u_soakPerAbsorb;
uniform float u_spawnerSize;
uniform vec2 u_pointerPosition;

// -----------
// -- Enums --
// -----------

const int DEBUG = 0;
const int EMPTY = 1;
const int BLOCK = 2;
const int SAND  = 3;
const int WATER = 4;
const int ICE   = 5;
const int STEAM = 6;
const int FIRE  = 7;

const int LEFT  = 1;
const int DOWN  = 2;
const int RIGHT = 3;
const int UP    = 4;

const int SPREAD_NONE = 0;
const int SPREAD_LOW  = 1;
const int SPREAD_MID  = 2;
const int SPREAD_HIGH = 3;
const int SPREAD_FULL = 4;

const int INTERACTION_NONE            = 0;
const int INTERACTION_BLOCK_AND_BLOCK = 1;
const int INTERACTION_BLOCK_AND_SAND  = 2;
const int INTERACTION_BLOCK_AND_WATER = 3;
const int INTERACTION_SAND_AND_SAND   = 4;
const int INTERACTION_SAND_AND_WATER  = 5;
const int INTERACTION_WATER_AND_WATER = 6;
const int INTERACTION_WATER_AND_FIRE  = 7;

// ------------
// -- Config --
// ------------


// -- Config --

// TODO: get from CPU config
const int TEMPERATURE_ABSOLUTE_ZERO = 0;
const int TEMPERATURE_WATER_FREEZE  = 2700;
const int TEMPERATURE_NORMAL        = 3000;
const int TEMPERATURE_WATER_BOIL    = 3700;
const int TEMPERATURE_WOOD_BURN     = 8000;
const int TEMPERATURE_METAL_MELT    = 15000;
const int TEMPERATURE_SAND_MELT     = 19000;
const int TEMPERATURE_MAXIMUM       = 30000;

const int TEMPERATURE_SPAWN[8] = int[8](
  3000,  // DEBUG
  3000,  // Empty
  3000,  // Block
  3000,  // Sand
  3000,  // Water
  2000,  // Ice
  3000,  // Steam
  12000  // Fire
);

const int MAX_THERMAL_TRANSFER[8] = int[8](
  -1,    // DEBUG
  100,   // Empty
  1000,  // Block
  1000,  // Sand
  1000,  // Water
  1000,  // Ice
  1000,  // Steam
  1000   // Fire
);

const int DENSITY[8] = int[8](
  0, // DEBUG
  0, // Empty
  9, // Block
  4, // Sand
  3, // Water
  9, // Ice
  2, // Steam
  1  // Fire
);

const int SPREAD[8] = int[8](
  SPREAD_NONE, // DEBUG
  SPREAD_NONE, // Empty
  SPREAD_NONE, // Block

  SPREAD_LOW,  // Sand
  SPREAD_MID,  // Water
  SPREAD_NONE, // Ice
  SPREAD_HIGH, // Steam
  SPREAD_HIGH  // Fire
);

// -------------
// -- Structs --
// -------------

struct Cell {
  int rng;
  int clock;
  int empty0;
  int empty1;

  int type;
  int temperature;
  int velocity;
  int isMoved;

  int state0;
  int state1;
  int state2;
  int state3;
};

struct Block {
  Cell bl;
  Cell tl;
  Cell tr;
  Cell br;
};

// -----------
// -- Fetch --
// -----------

Cell getCell(ivec2 grid) {
  ivec4 data0 = texelFetch(u_inputTexture0, grid, 0);
  ivec4 data1 = texelFetch(u_inputTexture1, grid, 0);
  ivec4 data2 = texelFetch(u_inputTexture2, grid, 0);

  Cell cell;

  cell.rng         = data0.r;
  cell.clock       = data0.g;
  cell.empty0      = data0.b;
  cell.empty1      = data0.a;

  cell.type        = data1.r;
  cell.temperature = data1.g;
  cell.velocity    = data1.b;
  cell.isMoved     = data1.a;

  cell.state0      = data2.r;
  cell.state1      = data2.g;
  cell.state2      = data2.b;
  cell.state3      = data2.a;

  return cell;
}

ivec2 getPartition() {
  int modTime = u_time % 8;

  if(modTime == 0) return ivec2( 0,  0);
  if(modTime == 1) return ivec2( 1,  1);
  if(modTime == 2) return ivec2( 0,  0);
  if(modTime == 3) return ivec2( 1, -1);
  if(modTime == 4) return ivec2( 0,  0);
  if(modTime == 5) return ivec2(-1, -1);
  if(modTime == 6) return ivec2( 0,  0);
                   return ivec2(-1,  1);
}

ivec2 getBlockOrigin(ivec2 grid) {
  ivec2 keepAboveZero = ivec2(2, 2);
  ivec2 offset = getPartition();
  ivec2 origin = ((grid + keepAboveZero - offset) / 2) * 2 + offset;
  return origin - keepAboveZero;
}

Block getBlock(ivec2 origin) {
  Block block;
  block.bl = getCell(origin);               // index: 0
  block.tl = getCell(origin + ivec2(0, 1)); // index: 1
  block.tr = getCell(origin + ivec2(1, 1)); // index: 2
  block.br = getCell(origin + ivec2(1, 0)); // index: 3
  return block;
}

int getInBlockIndex(ivec2 grid) {
  ivec2 blockOrigin = getBlockOrigin(grid);
  ivec2 remainder = grid - blockOrigin;
  return (1 - remainder.x) * remainder.y + remainder.x * (3 - remainder.y);
}

Cell getCellFromBlock(ivec2 grid, Block block) {
  int inBlockIndex = getInBlockIndex(grid);

  if(inBlockIndex == 0) return block.bl;
  if(inBlockIndex == 1) return block.tl;
  if(inBlockIndex == 2) return block.tr;
  if(inBlockIndex == 3) return block.br;
}

// ----------
// -- Misc --
// ----------

void resetCell(inout Cell cell) {
  // cell.rng;
  cell.clock       = 0;
  cell.empty0      = 0;
  cell.empty1      = 0;

  cell.type        = DEBUG;
  cell.temperature = TEMPERATURE_NORMAL;
  cell.velocity    = 0;
  cell.isMoved     = 0;

  cell.state0      = 0;
  cell.state1      = 0;
  cell.state2      = 0;
  cell.state3      = 0;
}

void balanceValues(inout int a, inout int b) {
  if(abs(a - b) < 2) return;

  int total = a + b;
  int aNew = 0;
  int bNew = 0;

  if(a > b) {
    aNew = (total + 1) / 2;
    bNew = total - aNew;
  }
  else {
    bNew = (total + 1) / 2;
    aNew = total - bNew;
  }

  a = aNew;
  b = bNew;
}

// --------------
// -- Rotation --
// --------------

int rotateVelocity(int velocity) {
  if(velocity == 0) return 0;
  if(velocity >= UP) return LEFT;
  return velocity + 1;
}

int reverseRotateVelocity(int velocity) {
  if(velocity == 0) return 0;
  if(velocity == LEFT) return UP;
  return velocity - 1;
}

void rotateBlock(inout Block block) {
  Block originalBlock = block;

  block.bl = originalBlock.tl;
  block.bl.velocity = rotateVelocity(block.bl.velocity);

  block.tl = originalBlock.tr;
  block.tl.velocity = rotateVelocity(block.tl.velocity);

  block.tr = originalBlock.br;
  block.tr.velocity = rotateVelocity(block.tr.velocity);

  block.br = originalBlock.bl;
  block.br.velocity = rotateVelocity(block.br.velocity);
}

void reverseRotateBlock(inout Block block) {
  Block originalBlock = block;

  block.bl = originalBlock.br;
  block.bl.velocity = reverseRotateVelocity(block.bl.velocity);

  block.tl = originalBlock.bl;
  block.tl.velocity = reverseRotateVelocity(block.tl.velocity);

  block.tr = originalBlock.tl;
  block.tr.velocity = reverseRotateVelocity(block.tr.velocity);

  block.br = originalBlock.tr;
  block.br.velocity = reverseRotateVelocity(block.br.velocity);
}

// --------------
// -- Behavior --
// --------------

// WIP: more stuff

// TODO: remove magic variables

void fireBehavior(inout Cell cell) {
  if(cell.clock + cell.rng >= 80) {
    if(cell.rng > 30) {
      resetCell(cell);
      cell.type = STEAM;
      cell.velocity = UP;
    } else {
      resetCell(cell);
      cell.type = EMPTY;
      cell.temperature = TEMPERATURE_NORMAL;
    }
  }
}

void steamBehavior(inout Cell cell) {
  if(cell.clock + cell.rng >= 120) {
    resetCell(cell);
    cell.type = EMPTY;
    cell.temperature = TEMPERATURE_NORMAL;
  }
}

void applyBehavior(inout Cell cell) {
  if(cell.type == FIRE) {
    fireBehavior(cell);
    return;
  }

  if(cell.type == STEAM) {
    steamBehavior(cell);
    return;
  }
}

// -----------------
// -- Interaction --
// -----------------

int getInteraction(int aType, int bType) {
  if(aType == DEBUG) {
    return INTERACTION_NONE;
  }

  if(aType == EMPTY) {
    return INTERACTION_NONE;
  }

  if(aType == BLOCK) {
    if(bType == BLOCK) return INTERACTION_BLOCK_AND_BLOCK;
    if(bType == SAND) return INTERACTION_BLOCK_AND_SAND;
    if(bType == WATER) return INTERACTION_BLOCK_AND_WATER;
    return INTERACTION_NONE;
  }

  if(aType == SAND) {
    if(bType == SAND) return INTERACTION_SAND_AND_SAND;
    if(bType == WATER) return INTERACTION_SAND_AND_WATER;
    return INTERACTION_NONE;
  }

  if(aType == WATER) {
    if(bType == FIRE) return INTERACTION_WATER_AND_FIRE;
    return INTERACTION_NONE;
  }

  if(aType == ICE) {
    return INTERACTION_NONE;
  }

  if(aType == STEAM) {
    return INTERACTION_NONE;
  }

  if(aType == FIRE) {
    return INTERACTION_NONE;
  }

  return INTERACTION_NONE;
}

void blockAndBlock(inout Cell a, inout Cell b) { }
void blockAndSand(inout Cell block, inout Cell sand) { }
void blockAndWater(inout Cell block, inout Cell water) { }

void sandAndWater(inout Cell sand, inout Cell water) {
  if(sand.state0 < u_soakPerAbsorb * u_maxSoakedCells) {
    balanceValues(sand.temperature, water.temperature);

    sand.state0 += u_soakPerAbsorb;

    resetCell(water);
    water.type = EMPTY;

    return;
  }
}

void sandAndSand(inout Cell a, inout Cell b) {
  balanceValues(a.state0, b.state0);
}

void waterAndFire(inout Cell a, inout Cell b) {
  int evenTemperature = (a.temperature + b.temperature) / 2;

  resetCell(a);
  a.type = STEAM;
  a.velocity = UP;
  a.temperature = evenTemperature;

  resetCell(b);
  b.type = STEAM;
  b.velocity = UP;
  b.temperature = evenTemperature;
}

void applyInteraction(inout Cell one, inout Cell two) {
  int interaction = getInteraction(one.type, two.type);

  if(interaction == INTERACTION_NONE) return;

  if(interaction == INTERACTION_BLOCK_AND_BLOCK) {
    blockAndBlock(one, two);
    return;
  }

  if(interaction == INTERACTION_BLOCK_AND_SAND) {
    blockAndSand(one, two);
    return;
  }

  if(interaction == INTERACTION_BLOCK_AND_WATER) {
    blockAndWater(one, two);
    return;
  }

  if(interaction == INTERACTION_SAND_AND_WATER) {
    sandAndWater(one, two);
    return;
  }

  if(interaction == INTERACTION_SAND_AND_SAND) {
    sandAndSand(one, two);
    return;
  }

  if(interaction == INTERACTION_WATER_AND_FIRE) {
    waterAndFire(one, two);
    return;
  }
}

// -----------
// -- Swaps --
// -----------

bool canSwap(Cell a, Cell b) {
  if(a.type == b.type) {
    if(a.type == WATER || a.type == STEAM || a.type == FIRE)
      return DENSITY[a.type] >= DENSITY[b.type];
  }

  return DENSITY[a.type] > DENSITY[b.type];
}

void swapCells(inout Cell a, inout Cell b) {
  Cell temp = a;
  a = b;
  b = temp;

  a.isMoved = 1;
  b.isMoved = 1;
}

void applySwapsToBL(inout Block block) {
  if(block.bl.type == DEBUG) return;
  if(block.bl.isMoved == 1) return;
  if(block.bl.velocity == 0) return;

  int spread = SPREAD[block.bl.type];

  // TODO: should those be if or else-if?

  if(block.bl.velocity == LEFT) {
    if(spread >= SPREAD_MID && canSwap(block.bl, block.tl)) 
      swapCells(block.bl, block.tl);
    if(spread >= SPREAD_HIGH && canSwap(block.bl, block.tr))
      swapCells(block.bl, block.tr);
    if(spread >= SPREAD_FULL && canSwap(block.bl, block.br))
      swapCells(block.bl, block.br);
  }

  if(block.bl.velocity == DOWN) {
    if(spread >= SPREAD_MID && canSwap(block.bl, block.br)) 
      swapCells(block.bl, block.br);
    if(spread >= SPREAD_HIGH && canSwap(block.bl, block.tr)) 
      swapCells(block.bl, block.tr);
    if(spread >= SPREAD_FULL && canSwap(block.bl, block.tl)) 
      swapCells(block.bl, block.tl);
  }

  if(block.bl.velocity == RIGHT) {
    if(canSwap(block.bl, block.br)) 
      swapCells(block.bl, block.br);
    if(spread >= SPREAD_LOW && canSwap(block.bl, block.tr)) 
      swapCells(block.bl, block.tr);
    if(spread >= SPREAD_MID && canSwap(block.bl, block.tl)) 
      swapCells(block.bl, block.tl);
  }

  if(block.bl.velocity == UP) {
    if(canSwap(block.bl, block.tl)) 
      swapCells(block.bl, block.tl);
    if(spread >= SPREAD_LOW && canSwap(block.bl, block.tr)) 
      swapCells(block.bl, block.tr);
    if(spread >= SPREAD_MID && canSwap(block.bl, block.br)) 
      swapCells(block.bl, block.br);
  }
}

void applySwapsToIndex(inout Block block, int blockIndex) {
  for(int i = 0; i < blockIndex; i++) {
    rotateBlock(block);
  }

  applySwapsToBL(block);

  for(int i = 0; i < blockIndex; i++) {
    reverseRotateBlock(block);
  }
}

void applyBlockSwaps(inout Block block, ivec4 applicationOrder) {
  applySwapsToIndex(block, applicationOrder.r);
  applySwapsToIndex(block, applicationOrder.g);
  applySwapsToIndex(block, applicationOrder.b);
  applySwapsToIndex(block, applicationOrder.a);
}

// -----------------
// -- Temperature --
// -----------------

void diffuseTemperature(inout Cell a, inout Cell b) {
  if(a.type == DEBUG || b.type == DEBUG) return;
  if (abs(a.temperature - b.temperature) < 2) return;

  int rateLimit = min(
    MAX_THERMAL_TRANSFER[a.type],
    MAX_THERMAL_TRANSFER[b.type]
  );

  if (a.temperature > b.temperature) {
    int diff = a.temperature - b.temperature;
    int idealTransfer = diff / 2;
    int transfer = min(idealTransfer, rateLimit);
    a.temperature -= transfer;
    b.temperature += transfer;
  } else {
    int diff = b.temperature - a.temperature;
    int idealTransfer = diff / 2;
    int transfer = min(idealTransfer, rateLimit);
    b.temperature -= transfer;
    a.temperature += transfer;
  }
}

void applyBlockTemperatureDiffusion(inout Block block, ivec4 applicationOrder) {
  for(int i = 0; i < 4; i++) {
    if     (applicationOrder[i] == 0) diffuseTemperature(block.bl, block.tl);
    else if(applicationOrder[i] == 1) diffuseTemperature(block.tl, block.tr);
    else if(applicationOrder[i] == 2) diffuseTemperature(block.tr, block.br);
    else                              diffuseTemperature(block.br, block.bl);
  }

  diffuseTemperature(block.br, block.tl);
  diffuseTemperature(block.bl, block.tr);
}

void transformCellByTemperature(inout Cell cell) {
  int type = cell.type;
  int temperature = cell.temperature;

  if(type == DEBUG) {
    return;
  }

  if(type == EMPTY) {
    return;
  }

  if(type == BLOCK) {
    return;
  }

  if(type == SAND) {
    if(temperature >= TEMPERATURE_SAND_MELT) {
      return;
    }
  }

  if(type == WATER) {
    if(temperature <= TEMPERATURE_WATER_FREEZE) {
      resetCell(cell);
      cell.type = ICE;
      cell.temperature = temperature;
      cell.velocity = 0;
      return;
    }
    return;
  }

  if(type == ICE) {
    if(temperature > TEMPERATURE_WATER_FREEZE) {
      resetCell(cell);
      cell.type = WATER;
      cell.temperature = temperature;
      cell.velocity = DOWN;
      return;
    }
    return;
  }

  if(type == STEAM) {
    if(temperature <= TEMPERATURE_WATER_BOIL) {
      return;
    }
    return;
  }

  if(type == FIRE) {
    return;
  }
}

void applyBlockTemperatureTransform(inout Block block) {
  transformCellByTemperature(block.bl);
  transformCellByTemperature(block.tl);
  transformCellByTemperature(block.tr);
  transformCellByTemperature(block.bl);
}

// -----------
// -- Logic --
// -----------

const ivec4 APPLICATION_PATTERNS[4] = ivec4[4] (
  ivec4(2, 0, 1, 3),
  ivec4(1, 3, 2, 0),
  ivec4(0, 1, 3, 2),
  ivec4(2, 3, 0, 1)
);

ivec4 getRandomApplicationPattern() {
  return APPLICATION_PATTERNS[u_random % 4];
}

void changeBlock(inout Block block) {
  applyBehavior(block.bl);
  applyBehavior(block.tl);
  applyBehavior(block.tr);
  applyBehavior(block.br);

  applyBlockTemperatureTransform(block);

  if(block.bl.type <= block.tl.type) applyInteraction(block.bl, block.tl);
  else                               applyInteraction(block.tl, block.bl);

  if(block.tl.type <= block.tr.type) applyInteraction(block.tl, block.tr);
  else                               applyInteraction(block.tr, block.tl);

  if(block.tr.type <= block.br.type) applyInteraction(block.tr, block.br);
  else                               applyInteraction(block.br, block.tr);

  if(block.br.type <= block.bl.type) applyInteraction(block.br, block.bl);
  else                               applyInteraction(block.bl, block.br);

  if(block.bl.type <= block.tr.type) applyInteraction(block.bl, block.tr);
  else                               applyInteraction(block.tr, block.bl);

  if(block.tl.type <= block.br.type) applyInteraction(block.tl, block.br);
  else                               applyInteraction(block.br, block.tl);

  ivec4 randomApplicationPattern = getRandomApplicationPattern();
  applyBlockSwaps(block, randomApplicationPattern);

  block.bl.isMoved = block.tl.isMoved = block.tr.isMoved = block.br.isMoved = 0;

  applyBlockTemperatureDiffusion(block, randomApplicationPattern);
}

// -----------
// -- Spawn --
// -----------

bool isClicked() {
  if(u_inputKey < 0) return false;
  return distance(u_pointerPosition, v_coordinates) < u_spawnerSize;
}

Cell spawnCell(ivec2 grid) {
  Cell cell = getCell(grid);

  int type = u_inputKey;

  resetCell(cell);
  cell.type = type;

  if (type == SAND || type == WATER) cell.velocity = DOWN;
  if (type == FIRE || type == STEAM) cell.velocity = UP;

  cell.temperature = TEMPERATURE_SPAWN[cell.type];

  return cell;
}

// ------------
// -- Output --
// ------------

void writeCellFragment(Cell cell, out ivec4 output0, out ivec4 output1, out ivec4 output2) {
  output0 = ivec4(
    cell.rng,
    cell.clock,
    cell.empty0,
    cell.empty1
  );

  output1 = ivec4(
    cell.type,
    cell.temperature,
    cell.velocity,
    cell.isMoved
  );

  output2 = ivec4(
    cell.state0,
    cell.state1,
    cell.state2,
    cell.state3
  );
}

void main() {
  ivec2 grid = ivec2(gl_FragCoord.xy);

  if(isClicked()) {
    writeCellFragment(spawnCell(grid), output0, output1, output2);
    return;
  }

  ivec2 blockOrigin = getBlockOrigin(grid);

  Block block = getBlock(blockOrigin);

  changeBlock(block);

  Cell thisCell = getCellFromBlock(grid, block);

  thisCell.clock++;

  writeCellFragment(thisCell, output0, output1, output2);
}
