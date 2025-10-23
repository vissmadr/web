import { Creative } from "@packages/creative";

const canvasID = "mainCanvas";
const canvas = document.getElementById(canvasID) as HTMLCanvasElement;
if (!canvas) throw `Cannot get #${canvasID}`;

// Creative.WebGL.Sandfall.main(canvas);
Creative.Canvas2D.SpecularReflection.main(canvas)
