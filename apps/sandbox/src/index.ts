import { Creative } from "@packages/creative";
import { Sandfall } from "@packages/sandfall";

const canvasID = "mainCanvas";
const canvas = document.getElementById(canvasID) as HTMLCanvasElement;
if (!canvas) throw `Cannot get #${canvasID}`;

Creative.WebGL.Dissolve.main(canvas);
