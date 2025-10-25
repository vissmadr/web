import { Creative } from "@packages/creative";
import { ParticleOrigins } from "@packages/particle-origins";
import { Sandtext } from "@packages/sandtext";

const canvasID = "mainCanvas";
const canvas = document.getElementById(canvasID) as HTMLCanvasElement;
if (!canvas) throw `Cannot get #${canvasID}`;

// Sandtext.main(canvas);

ParticleOrigins.main();
