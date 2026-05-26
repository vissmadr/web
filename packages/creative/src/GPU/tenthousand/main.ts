import { WebGL } from "@utilities/webgl";

import computeVertex from "./compute-vertex.glsl";
import computeFragment from "./compute-fragment.glsl";
import renderVertex from "./render-vertex.glsl";
import renderFragment from "./render-fragment.glsl";

import img from "./tenthousand.png";

const defaultConfig = {
  canvasWidth: 600,
  canvasHeight: 600,
  particlesCount: 10_000,
  brightness: 3,
  speed: 0.0001,
  minSize: 1.5,
  sizeScalar: 2.0,
};

type Config = typeof defaultConfig;

let config: Config;

const image = new Image();

function setupPrograms(gl: WebGL2RenderingContext) {
  const computeVS = WebGL.Setup.compileShader(gl, "vertex", computeVertex);
  const computeFS = WebGL.Setup.compileShader(gl, "fragment", computeFragment);
  const computeProgram = WebGL.Setup.linkTransformFeedbackProgram(
    gl,
    computeVS,
    computeFS,
    ["newPosition"],
    "separate",
  );

  const renderVS = WebGL.Setup.compileShader(gl, "vertex", renderVertex);
  const renderFS = WebGL.Setup.compileShader(gl, "fragment", renderFragment);
  const renderProgram = WebGL.Setup.linkProgram(gl, renderVS, renderFS);

  return { compute: computeProgram, render: renderProgram };
}

function generatePositionData() {
  const positions = new Float32Array(config.particlesCount * 2);
  for (let i = 0; i < config.particlesCount; i++) {
    const index = i * 2;
    positions[index] = Math.random();
    positions[index + 1] = Math.random();
  }
  return positions;
}

function generateVelocityData() {
  const velocities = new Float32Array(config.particlesCount * 2);
  for (let i = 0; i < config.particlesCount; i++) {
    const angle = Math.random() * Math.PI * 2;

    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    const index = i * 2;
    velocities[index] = cos;
    velocities[index + 1] = sin;
  }
  return velocities;
}

function setupTexture(gl: WebGL2RenderingContext) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  WebGL.Texture.applyClampAndNearest(gl);
}

function setupUniformBlock(gl: WebGL2RenderingContext, computeProgram: WebGLProgram, renderProgram: WebGLProgram) {
  const blockIndexInCompute = gl.getUniformBlockIndex(computeProgram, "GlobalStaticData");
  const blockIndexInRender = gl.getUniformBlockIndex(renderProgram, "GlobalStaticData");

  gl.uniformBlockBinding(computeProgram, blockIndexInCompute, 0);
  gl.uniformBlockBinding(renderProgram, blockIndexInRender, 0);

  const data = [config.brightness, config.speed, config.minSize, config.sizeScalar];

  const uniformBuffer = gl.createBuffer();
  gl.bindBuffer(gl.UNIFORM_BUFFER, uniformBuffer);
  gl.bufferData(gl.UNIFORM_BUFFER, data.length * 16, gl.STATIC_DRAW);

  gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, uniformBuffer);

  const globalStaticData = new Float32Array(data);
  gl.bufferSubData(gl.UNIFORM_BUFFER, 0, globalStaticData);
}

function setupState(gl: WebGL2RenderingContext, computeProgram: WebGLProgram, renderProgram: WebGLProgram) {
  setupUniformBlock(gl, computeProgram, renderProgram);

  const locations = {
    compute: {
      aOldPosition: gl.getAttribLocation(computeProgram, "a_oldPosition"),
      aVelocity: gl.getAttribLocation(computeProgram, "a_velocity"),
    },
    render: {
      aNewPosition: gl.getAttribLocation(renderProgram, "a_newPosition"),
      uTextureIndex: gl.getUniformLocation(renderProgram, "u_textureIndex"),
    },
  } as const;

  const data = {
    positions: generatePositionData(),
    velocities: generateVelocityData(),
  } as const;

  const buffers = {
    positionHeads: gl.createBuffer()!,
    positionTails: gl.createBuffer()!,
    velocity: gl.createBuffer()!,
  } as const;

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionHeads);
  gl.bufferData(gl.ARRAY_BUFFER, data.positions, gl.STREAM_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionTails);
  gl.bufferData(gl.ARRAY_BUFFER, data.positions, gl.STREAM_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.velocity);
  gl.bufferData(gl.ARRAY_BUFFER, data.velocities, gl.STATIC_DRAW);

  // ------------------------
  // -- Transform Feedback --
  // ------------------------

  const transformFeedbacks = {
    firstPosition: gl.createTransformFeedback(),
    nextPosition: gl.createTransformFeedback(),
  };

  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedbacks.firstPosition);
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, buffers.positionHeads);

  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedbacks.nextPosition);
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, buffers.positionTails);

  // --------------------------
  // -- Vertex Array Objects --
  // --------------------------

  const vertexArrayObjects = {
    computeHeads: gl.createVertexArray(),
    computeTails: gl.createVertexArray(),
    renderHeads: gl.createVertexArray(),
    renderTails: gl.createVertexArray(),
  };

  // compute VAO first data
  gl.bindVertexArray(vertexArrayObjects.computeHeads);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionHeads);
  gl.enableVertexAttribArray(locations.compute.aOldPosition);
  gl.vertexAttribPointer(locations.compute.aOldPosition, 2, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.velocity);
  gl.enableVertexAttribArray(locations.compute.aVelocity);
  gl.vertexAttribPointer(locations.compute.aVelocity, 2, gl.FLOAT, false, 0, 0);

  // compute VAO next data
  gl.bindVertexArray(vertexArrayObjects.computeTails);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionTails);
  gl.enableVertexAttribArray(locations.compute.aOldPosition);
  gl.vertexAttribPointer(locations.compute.aOldPosition, 2, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.velocity);
  gl.enableVertexAttribArray(locations.compute.aVelocity);
  gl.vertexAttribPointer(locations.compute.aVelocity, 2, gl.FLOAT, false, 0, 0);

  // render VAO first data
  gl.bindVertexArray(vertexArrayObjects.renderHeads);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionHeads);
  gl.enableVertexAttribArray(locations.render.aNewPosition);
  gl.vertexAttribPointer(locations.render.aNewPosition, 2, gl.FLOAT, false, 0, 0);

  // render VAO next data
  gl.bindVertexArray(vertexArrayObjects.renderTails);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionTails);
  gl.enableVertexAttribArray(locations.render.aNewPosition);
  gl.vertexAttribPointer(locations.render.aNewPosition, 2, gl.FLOAT, false, 0, 0);

  // ----------------------
  // -- Unbind leftovers --
  // ----------------------

  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, null);

  return { buffers, vertexArrayObjects, transformFeedbacks };
}

export function main(canvas: HTMLCanvasElement, settings: Partial<Config> = {}): () => void {
  config = { ...defaultConfig, ...settings };

  const gl = canvas.getContext("webgl2");
  if (!gl) throw new Error("Failed to get WebGL2 context");

  canvas.width = config.canvasWidth;
  canvas.height = config.canvasHeight;

  image.src = img;

  const animationState = { id: 0 };

  let glResources: {
    programs: ReturnType<typeof setupPrograms>;
    buffers: { positionHeads: WebGLBuffer; positionTails: WebGLBuffer; velocity: WebGLBuffer };
    vertexArrayObjects: { computeHeads: WebGLVertexArrayObject | null; computeTails: WebGLVertexArrayObject | null; renderHeads: WebGLVertexArrayObject | null; renderTails: WebGLVertexArrayObject | null };
    transformFeedbacks: { firstPosition: WebGLTransformFeedback | null; nextPosition: WebGLTransformFeedback | null };
  } | null = null;

  image.onload = () => {
    const programs = setupPrograms(gl);

    const { buffers, vertexArrayObjects, transformFeedbacks } = setupState(gl, programs.compute, programs.render);

    glResources = { programs, buffers, vertexArrayObjects, transformFeedbacks };

    setupTexture(gl);

    let swapOne = {
      computeVAO: vertexArrayObjects.computeHeads,
      renderVAO: vertexArrayObjects.renderTails,
      TF: transformFeedbacks.nextPosition,
    };

    let swapTwo = {
      computeVAO: vertexArrayObjects.computeTails,
      renderVAO: vertexArrayObjects.renderHeads,
      TF: transformFeedbacks.firstPosition,
    };

    WebGL.Canvas.resizeToDisplaySize(canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.08, 0.08, 0.08, 1.0);

    const computeLoop = () => {
      gl.useProgram(programs.compute);
      gl.bindVertexArray(swapOne.computeVAO);

      gl.enable(gl.RASTERIZER_DISCARD);
      gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, swapOne.TF);
      gl.beginTransformFeedback(gl.POINTS);
      gl.drawArrays(gl.POINTS, 0, config.particlesCount);
      gl.endTransformFeedback();
      gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);
      gl.disable(gl.RASTERIZER_DISCARD);
    };

    const renderLoop = () => {
      gl.useProgram(programs.render);
      gl.bindVertexArray(swapOne.renderVAO);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, config.particlesCount);
    };

    let swap: {
      computeVAO: WebGLVertexArrayObject;
      renderVAO: WebGLVertexArrayObject;
      TF: WebGLTransformFeedback;
    };

    const mainLoop = () => {
      computeLoop();
      renderLoop();

      swap = swapOne;
      swapOne = swapTwo;
      swapTwo = swap;

      animationState.id = requestAnimationFrame(mainLoop);
    };

    animationState.id = requestAnimationFrame(mainLoop);
  };

  return () => {
    cancelAnimationFrame(animationState.id);

    if (glResources) {
      const { programs, buffers, vertexArrayObjects, transformFeedbacks } = glResources;

      gl.deleteProgram(programs.compute);
      gl.deleteProgram(programs.render);

      gl.deleteVertexArray(vertexArrayObjects.computeHeads);
      gl.deleteVertexArray(vertexArrayObjects.computeTails);
      gl.deleteVertexArray(vertexArrayObjects.renderHeads);
      gl.deleteVertexArray(vertexArrayObjects.renderTails);

      gl.deleteTransformFeedback(transformFeedbacks.firstPosition);
      gl.deleteTransformFeedback(transformFeedbacks.nextPosition);

      gl.deleteBuffer(buffers.positionHeads);
      gl.deleteBuffer(buffers.positionTails);
      gl.deleteBuffer(buffers.velocity);
    }
  };
}
