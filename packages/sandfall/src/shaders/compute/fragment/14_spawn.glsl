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
