import { NoiseGLSL } from "@utilities/noise-glsl";
import { WebGL } from "@utilities/webgl";

import { Config, defaultConfig } from "./config";

import computeVertex from "./shaders/compute-vertex.glsl";
import computeFragment from "./shaders/compute-fragment.glsl";
import renderVertex from "./shaders/render-vertex.glsl";
import renderFragment from "./shaders/render-fragment.glsl";

import { rawParticleOrigins } from "./raw";

import vissmadrPNG from "./vissmadr.png";

const image = new Image();

const particleCount = Math.floor(rawParticleOrigins.length / 2);

let config: Config;

function setupGL(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl2");
  if (!gl) throw new Error("Failed to get WebGL2 context");

  canvas.width = image.width;
  canvas.height = image.height;

  WebGL.Canvas.resizeToDisplaySize(canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0.08, 0.08, 0.08, 1.0);

  return gl;
}

function setupPrograms(gl: WebGL2RenderingContext) {
  const fullComputeVS = WebGL.GLSL.getBegin() + NoiseGLSL.Simplex.default + computeVertex;
  const computeVS = WebGL.Setup.compileShader(gl, "vertex", fullComputeVS);
  const computeFS = WebGL.Setup.compileShader(gl, "fragment", computeFragment);
  const computeProgram = WebGL.Setup.linkTransformFeedbackProgram(
    gl,
    computeVS,
    computeFS,
    ["tf_position"],
    "separate",
  );

  const renderVS = WebGL.Setup.compileShader(gl, "vertex", renderVertex);
  const renderFS = WebGL.Setup.compileShader(gl, "fragment", renderFragment);
  const renderProgram = WebGL.Setup.linkProgram(gl, renderVS, renderFS);

  return { compute: computeProgram, render: renderProgram } as const;
}

// NOTE: The particle origins array can be stored as raw
// data file. Use this function to generate such a file
function createParticleOrigins(image: HTMLImageElement) {
  const auxCanvas = document.createElement("canvas");
  auxCanvas.width = image.width;
  auxCanvas.height = image.height;

  const auxContext = auxCanvas.getContext("2d");
  if (!auxContext) throw "Cannot get aux 2d context!";

  auxContext.fillStyle = "#000000";
  auxContext.fillRect(0, 0, auxCanvas.width, auxCanvas.height);

  auxContext.drawImage(image, 0, 0, auxCanvas.width, auxCanvas.height);
  const imageData = auxContext.getImageData(0, 0, auxCanvas.width, auxCanvas.height).data;

  auxContext.clearRect(0, 0, auxCanvas.width, auxCanvas.height);

  const xParticleOrigins: number[] = [];
  const yParticleOrigins: number[] = [];
  for (let i = 0; i < imageData.length; i += 4) {
    const r = imageData[i + 0];
    const g = imageData[i + 1];
    const b = imageData[i + 2];

    const index = i / 4;
    const x = index % auxCanvas.width;
    const y = Math.floor(index / auxCanvas.width);

    if (r + g + b > 80) {
      xParticleOrigins.push(x);
      yParticleOrigins.push(y);
    }
  }

  const particleCount = xParticleOrigins.length;

  const particleOrigins: number[] = [];
  for (let i = 0; i < particleCount; i++) {
    particleOrigins.push(xParticleOrigins[i] / image.width);
    particleOrigins.push(1 - yParticleOrigins[i] / image.height);
  }

  const output = particleOrigins.map((v) => Number(v.toFixed(4)));
  console.log("export const textorigins = new Float32Array(" + JSON.stringify(output) + ");");
}

function generateRNG() {
  let rngSeed = Math.ceil(Math.random() * 0xffffff);

  const xorshift = () => {
    rngSeed ^= rngSeed << 13;
    rngSeed ^= rngSeed >> 17;
    rngSeed ^= rngSeed << 5;
    return rngSeed;
  };

  const random: number[] = [];
  for (let i = 0; i < particleCount; i++) {
    random.push(Math.abs((xorshift() % 0xffffff) / 0xffffff));
  }

  return new Float32Array(random);
}

function setupState(gl: WebGL2RenderingContext, computeProgram: WebGLProgram, renderProgram: WebGLProgram) {
  const random = generateRNG();

  const uniforms = {
    compute: {
      u_time: gl.getUniformLocation(computeProgram, "u_time"),
      u_noiseFrequency: gl.getUniformLocation(computeProgram, "u_noiseFrequency"),
      u_returnSpeed: gl.getUniformLocation(computeProgram, "u_returnSpeed"),
      u_noiseScalar: gl.getUniformLocation(computeProgram, "u_noiseScalar"),
    },
    render: {
      u_size: gl.getUniformLocation(renderProgram, "u_size"),
    },
  } as const;

  const attributes = {
    compute: {
      a_position: gl.getAttribLocation(computeProgram, "a_position"),
      a_textOrigin: gl.getAttribLocation(computeProgram, "a_textOrigin"),
      a_random: gl.getAttribLocation(computeProgram, "a_random"),
    },
    render: {
      tf_position: gl.getAttribLocation(renderProgram, "tf_position"),
      a_random: gl.getAttribLocation(renderProgram, "a_random"),
    },
  } as const;

  const buffers = {
    positionHeads: gl.createBuffer(),
    positionTails: gl.createBuffer(),
    textOrigins: gl.createBuffer(),
    random: gl.createBuffer(),
  } as const;

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionHeads);
  gl.bufferData(gl.ARRAY_BUFFER, rawParticleOrigins, gl.DYNAMIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionTails);
  gl.bufferData(gl.ARRAY_BUFFER, rawParticleOrigins, gl.DYNAMIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textOrigins);
  gl.bufferData(gl.ARRAY_BUFFER, rawParticleOrigins, gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.random);
  gl.bufferData(gl.ARRAY_BUFFER, random, gl.STATIC_DRAW);

  const vertexArrayObjects = {
    compute: {
      heads: gl.createVertexArray(),
      tails: gl.createVertexArray(),
    },
    render: {
      heads: gl.createVertexArray(),
      tails: gl.createVertexArray(),
    },
  } as const;

  // -----------------------
  // -- VAO Compute Heads --
  // -----------------------

  gl.bindVertexArray(vertexArrayObjects.compute.heads);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionHeads);
  gl.enableVertexAttribArray(attributes.compute.a_position);
  gl.vertexAttribPointer(attributes.compute.a_position, 2, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textOrigins);
  gl.enableVertexAttribArray(attributes.compute.a_textOrigin);
  gl.vertexAttribPointer(attributes.compute.a_textOrigin, 2, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.random);
  gl.enableVertexAttribArray(attributes.compute.a_random);
  gl.vertexAttribPointer(attributes.compute.a_random, 1, gl.FLOAT, false, 0, 0);

  // -----------------------
  // -- VAO Compute Tails --
  // -----------------------

  gl.bindVertexArray(vertexArrayObjects.compute.tails);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionTails);
  gl.enableVertexAttribArray(attributes.compute.a_position);
  gl.vertexAttribPointer(attributes.compute.a_position, 2, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textOrigins);
  gl.enableVertexAttribArray(attributes.compute.a_textOrigin);
  gl.vertexAttribPointer(attributes.compute.a_textOrigin, 2, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.random);
  gl.enableVertexAttribArray(attributes.compute.a_random);
  gl.vertexAttribPointer(attributes.compute.a_random, 1, gl.FLOAT, false, 0, 0);

  // ----------------------
  // -- VAO Render Heads --
  // ----------------------

  gl.bindVertexArray(vertexArrayObjects.render.heads);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionHeads);
  gl.enableVertexAttribArray(attributes.render.tf_position);
  gl.vertexAttribPointer(attributes.render.tf_position, 2, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.random);
  gl.enableVertexAttribArray(attributes.render.a_random);
  gl.vertexAttribPointer(attributes.render.a_random, 1, gl.FLOAT, false, 0, 0);

  // ----------------------
  // -- Vao Render Tails --
  // ----------------------

  gl.bindVertexArray(vertexArrayObjects.render.tails);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionTails);
  gl.enableVertexAttribArray(attributes.render.tf_position);
  gl.vertexAttribPointer(attributes.render.tf_position, 2, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.random);
  gl.enableVertexAttribArray(attributes.render.a_random);
  gl.vertexAttribPointer(attributes.render.a_random, 1, gl.FLOAT, false, 0, 0);

  // -------------------------
  // -- Transform Feedbacks --
  // -------------------------

  const transformFeedbacks = {
    heads: gl.createTransformFeedback(),
    tails: gl.createTransformFeedback(),
  } as const;

  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedbacks.heads);
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, buffers.positionHeads);

  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedbacks.tails);
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, buffers.positionTails);

  // ----------------------
  // -- Unbind leftovers --
  // ----------------------

  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, null);

  return { uniforms, vertexArrayObjects, transformFeedbacks } as const;
}

function start(canvas: HTMLCanvasElement, settings: Partial<Config> = {}) {
  config = { ...defaultConfig, ...settings };

  const gl = setupGL(canvas);

  const programs = setupPrograms(gl);

  const { uniforms, vertexArrayObjects, transformFeedbacks } = setupState(gl, programs.compute, programs.render);

  let swapOne = {
    computeVAO: vertexArrayObjects.compute.heads,
    TF: transformFeedbacks.tails,
    renderVAO: vertexArrayObjects.render.tails,
  };

  let swapTwo = {
    computeVAO: vertexArrayObjects.compute.tails,
    TF: transformFeedbacks.heads,
    renderVAO: vertexArrayObjects.render.heads,
  };

  gl.useProgram(programs.compute);
  gl.uniform1f(uniforms.compute.u_noiseFrequency, config.noiseFrequency);
  gl.uniform2f(uniforms.compute.u_returnSpeed, config.returnSpeed.min, config.returnSpeed.max);
  gl.uniform2f(uniforms.compute.u_noiseScalar, config.noiseScalar.min, config.noiseScalar.max);
  gl.useProgram(programs.render);
  gl.uniform2f(uniforms.render.u_size, config.particleSize.min, config.particleSize.max);

  let time = 0;
  const computeLoop = () => {
    time += config.timeIncrement;

    gl.useProgram(programs.compute);
    gl.bindVertexArray(swapOne.computeVAO);

    gl.uniform1f(uniforms.compute.u_time, time);

    gl.enable(gl.RASTERIZER_DISCARD);
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, swapOne.TF);
    gl.beginTransformFeedback(gl.POINTS);
    gl.drawArrays(gl.POINTS, 0, particleCount);
    gl.endTransformFeedback();
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);
    gl.disable(gl.RASTERIZER_DISCARD);
  };

  const renderLoop = () => {
    gl.useProgram(programs.render);
    gl.bindVertexArray(swapOne.renderVAO);

    gl.drawArrays(gl.POINTS, 0, particleCount);
  };

  let swap: {
    computeVAO: WebGLVertexArrayObject;
    TF: WebGLTransformFeedback;
    renderVAO: WebGLVertexArrayObject;
  };

  let lastFrame = 0;
  const fpsTarget = 1_000 / config.FPS;
  const loop = (now: number) => {
    const delta = now - lastFrame;
    if (delta >= fpsTarget) {
      computeLoop();
      renderLoop();

      swap = swapOne;
      swapOne = swapTwo;
      swapTwo = swap;

      lastFrame = now - (delta % fpsTarget);
    }

    requestAnimationFrame(loop);
  };

  requestAnimationFrame(loop);
}

export function main(canvas: HTMLCanvasElement, settings: Partial<Config> = {}) {
  image.src = vissmadrPNG;
  image.onload = () => {
    start(canvas, settings);
  };
}
