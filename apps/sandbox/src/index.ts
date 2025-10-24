import { Creative } from "@packages/creative";
import { Sandtext } from "@packages/sandtext";

const canvasID = "mainCanvas";
const canvas = document.getElementById(canvasID) as HTMLCanvasElement;
if (!canvas) throw `Cannot get #${canvasID}`;

Sandtext.main(canvas);
