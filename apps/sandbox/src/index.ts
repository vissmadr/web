import { Creative } from "@packages/creative";
import { Prototype } from "@packages/prototype";

const canvasID = "mainCanvas";
const canvas = document.getElementById(canvasID) as HTMLCanvasElement;
if (!canvas) throw `Cannot get #${canvasID}`;

// Creative.CPU.InvokerOrbs.main(canvas);
Prototype.main(canvas);
