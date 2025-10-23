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
