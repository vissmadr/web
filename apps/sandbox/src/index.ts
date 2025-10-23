import { Creative } from "@packages/creative";
import { Pathfinder } from "@packages/pathfinder";

const canvasID = "mainCanvas";
const canvas = document.getElementById(canvasID) as HTMLCanvasElement;
if (!canvas) throw `Cannot get #${canvasID}`;
