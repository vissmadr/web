import { WebGL } from "@utilities/webgl";
import { Generator } from "./generator";
import { Config } from "./config";
import { Input } from "./input";

import computeVertex from "./shaders/compute/vertex.glsl";
import computeFragmentConfig from "./shaders/compute/fragment/config.glsl";
import computeFragmentData from "./shaders/compute/fragment/data.glsl";
import computeFragmentEnums from "./shaders/compute/fragment/enums.glsl";
import computeFragmentFetch from "./shaders/compute/fragment/fetch.glsl";
import computeFragmentSpawn from "./shaders/compute/fragment/spawn.glsl";
import computeFragmentInteraction from "./shaders/compute/fragment/interaction.glsl";
import computeFragmentLogic from "./shaders/compute/fragment/logic.glsl";
import computeFragmentMain from "./shaders/compute/fragment/main.glsl";
import computeFragmentMisc from "./shaders/compute/fragment/misc.glsl";
import computeFragmentOutput from "./shaders/compute/fragment/output.glsl";
import computeFragmentRotation from "./shaders/compute/fragment/rotation.glsl";
import computeFragmentStructure from "./shaders/compute/fragment/structure.glsl";
import computeFragmentSwaps from "./shaders/compute/fragment/swaps.glsl";
import computeFragmentTemperature from "./shaders/compute/fragment/temperature.glsl";
import renderVertex from "./shaders/render/vertex.glsl";
import renderFragment from "./shaders/render/fragment.glsl";

function setupPrograms(gl: WebGL2RenderingContext) {
  const combinedComputeFragment =
    computeFragmentMain +
    computeFragmentData +
    computeFragmentEnums +
    computeFragmentConfig +
    computeFragmentStructure +
    computeFragmentFetch +
    computeFragmentMisc +
    computeFragmentRotation +
    computeFragmentInteraction +
    computeFragmentSwaps +
    computeFragmentTemperature +
    computeFragmentLogic +
    computeFragmentSpawn +
    computeFragmentOutput;

  const computeVS = WebGL.Setup.compileShader(gl, "vertex", computeVertex);
  const computeFS = WebGL.Setup.compileShader(gl, "fragment", combinedComputeFragment);
  const renderVS = WebGL.Setup.compileShader(gl, "vertex", renderVertex);
  const renderFS = WebGL.Setup.compileShader(gl, "fragment", renderFragment);

  return {
    compute: WebGL.Setup.linkProgram(gl, computeVS, computeFS),
    render: WebGL.Setup.linkProgram(gl, renderVS, renderFS),
  };
}

function setupState(gl: WebGL2RenderingContext, computeProgram: WebGLProgram, renderProgram: WebGLProgram) {
  const locations = {
    compute: {
      aCanvasVertices: gl.getAttribLocation(computeProgram, "a_canvasVertices"),

      uInputTexture0: gl.getUniformLocation(computeProgram, "u_inputTexture0"),
      uInputTexture1: gl.getUniformLocation(computeProgram, "u_inputTexture1"),
      uInputTexture2: gl.getUniformLocation(computeProgram, "u_inputTexture2"),

      uPartition: gl.getUniformLocation(computeProgram, "u_partition"),
      uIsPointerDown: gl.getUniformLocation(computeProgram, "u_isPointerDown"),
      uTime: gl.getUniformLocation(computeProgram, "u_time"),
      uRandom: gl.getUniformLocation(computeProgram, "u_random"),
      uInputKey: gl.getUniformLocation(computeProgram, "u_inputKey"),
      uMaxSoakedCells: gl.getUniformLocation(computeProgram, "u_maxSoakedCells"),
      uSoakPerAbsorb: gl.getUniformLocation(computeProgram, "u_soakPerAbsorb"),
      uSpawnerSize: gl.getUniformLocation(computeProgram, "u_spawnerSize"),
      uPointerPosition: gl.getUniformLocation(computeProgram, "u_pointerPosition"),
    },

    render: {
      uOutputTexture0: gl.getUniformLocation(renderProgram, "u_outputTexture0"),
      uOutputTexture1: gl.getUniformLocation(renderProgram, "u_outputTexture1"),
      uOutputTexture2: gl.getUniformLocation(renderProgram, "u_outputTexture2"),

      uMaxSoakedCells: gl.getUniformLocation(renderProgram, "u_maxSoakedCells"),
      uSoakPerAbsorb: gl.getUniformLocation(renderProgram, "u_soakPerAbsorb"),
      uCanvas: gl.getUniformLocation(renderProgram, "u_canvas"),
      uColumns: gl.getUniformLocation(renderProgram, "u_columns"),
      uBorderSize: gl.getUniformLocation(renderProgram, "u_borderSize"),
    },
  };

  const data = {
    state0: new Int16Array(Generator.generate0()),
    state1: new Int16Array(Generator.generate1()),
    state2: new Int16Array(Generator.generate2()),
    canvasVertices: new Float32Array(WebGL.Points.rectangle(0, 0, 1, 1)),
  };

  const vertexArrayObjects = {
    update: gl.createVertexArray(),
    render: gl.createVertexArray(),
  };

  const textures = {
    main0: gl.createTexture(),
    aux0: gl.createTexture(),
    main1: gl.createTexture(),
    aux1: gl.createTexture(),
    main2: gl.createTexture(),
    aux2: gl.createTexture(),
  };

  const framebuffers = {
    update: gl.createFramebuffer(),
  };

  gl.bindVertexArray(vertexArrayObjects.update);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, data.canvasVertices, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(locations.compute.aCanvasVertices);
  gl.vertexAttribPointer(locations.compute.aCanvasVertices, 2, gl.FLOAT, false, 0, 0);

  gl.bindTexture(gl.TEXTURE_2D, textures.main0);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16I, Config.columns, Config.columns, 0, gl.RGBA_INTEGER, gl.SHORT, data.state0);
  WebGL.Texture.applyClampAndNearest(gl);

  gl.bindTexture(gl.TEXTURE_2D, textures.aux0);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16I, Config.columns, Config.columns, 0, gl.RGBA_INTEGER, gl.SHORT, data.state0);
  WebGL.Texture.applyClampAndNearest(gl);

  gl.bindTexture(gl.TEXTURE_2D, textures.main1);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16I, Config.columns, Config.columns, 0, gl.RGBA_INTEGER, gl.SHORT, data.state1);
  WebGL.Texture.applyClampAndNearest(gl);

  gl.bindTexture(gl.TEXTURE_2D, textures.aux1);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16I, Config.columns, Config.columns, 0, gl.RGBA_INTEGER, gl.SHORT, data.state1);
  WebGL.Texture.applyClampAndNearest(gl);

  gl.bindTexture(gl.TEXTURE_2D, textures.main2);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16I, Config.columns, Config.columns, 0, gl.RGBA_INTEGER, gl.SHORT, data.state2);
  WebGL.Texture.applyClampAndNearest(gl);

  gl.bindTexture(gl.TEXTURE_2D, textures.aux2);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16I, Config.columns, Config.columns, 0, gl.RGBA_INTEGER, gl.SHORT, data.state2);
  WebGL.Texture.applyClampAndNearest(gl);

  return { locations, vertexArrayObjects, textures, framebuffers };
}

function setupGL(canvas: HTMLCanvasElement){
  const gl = canvas.getContext("webgl2");
  if (!gl) throw "Failed to get WebGL2 context";

  WebGL.Canvas.resizeToDisplaySize(canvas);

  gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  gl.clearColor(0.08, 0.08, 0.08, 1.0);

  return gl;
}

export function main(canvas: HTMLCanvasElement) {
  const gl = setupGL(canvas);

  const input = new Input();
  input.setup(canvas);

  const programs = setupPrograms(gl);

  const { locations, vertexArrayObjects, textures, framebuffers } = setupState(gl, programs);

  let time: number = 0;

  const updateLoop = () => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffers.update);
    gl.viewport(0, 0, Config.columns, Config.columns);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, textures.aux0, 0);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, textures.aux1, 0);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT2, gl.TEXTURE_2D, textures.aux2, 0);
    gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1, gl.COLOR_ATTACHMENT2]);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textures.main0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, textures.main1);

    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, textures.main2);

    gl.useProgram(programs.update);
    gl.bindVertexArray(vertexArrayObjects.update);

    gl.uniform1i(locations.update.uInputTexture0, 0);
    gl.uniform1i(locations.update.uInputTexture1, 1);
    gl.uniform1i(locations.update.uInputTexture2, 2);
    gl.uniform1i(locations.update.uIsPointerDown, Number(this.input.getIsPointerDown()));
    gl.uniform1i(locations.update.uTime, time);
    gl.uniform1i(locations.update.uRandom, Random.rangeInt(0, 65000));
    gl.uniform1i(locations.update.uInputKey, this.input.getSpawnKey());
    gl.uniform1i(locations.update.uMaxSoakedCells, Config.maxSoakedCells);
    gl.uniform1i(locations.update.uSoakPerAbsorb, Config.soakPerAbsorb);
    gl.uniform1f(locations.update.uSpawnerSize, Config.spawnerSize);
    const pointerCoordinates = this.input.getPointerCoordinates();
    gl.uniform2f(locations.update.uPointerPosition, pointerCoordinates.x, pointerCoordinates.y);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };

  const renderLoop = () => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textures.aux0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, textures.aux1);

    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, textures.aux2);

    gl.useProgram(programs.render);
    gl.bindVertexArray(vertexArrayObjects.render);

    gl.uniform1i(locations.render.uOutputTexture0, 0);
    gl.uniform1i(locations.render.uOutputTexture1, 1);
    gl.uniform1i(locations.render.uOutputTexture2, 2);
    gl.uniform1i(locations.render.uMaxSoakedCells, Config.maxSoakedCells);
    gl.uniform1i(locations.render.uSoakPerAbsorb, Config.soakPerAbsorb);
    gl.uniform1f(locations.render.uCanvas, this.canvas.width);
    gl.uniform1f(locations.render.uColumns, Config.columns);
    gl.uniform1f(locations.render.uBorderSize, Config.borderSize);

    gl.drawArrays(gl.POINTS, 0, Config.columns ** 2);
  };

  const mainLoop = () => {
    updateLoop();
    renderLoop();

    time++;

    const swap0 = textures.main0;
    textures.main0 = textures.aux0;
    textures.aux0 = swap0;

    const swap1 = textures.main1;
    textures.main1 = textures.aux1;
    textures.aux1 = swap1;

    const swap2 = textures.main2;
    textures.main2 = textures.aux2;
    textures.aux2 = swap2;

    if (!Config.debug && !Config.limitFPS) requestAnimationFrame(mainLoop);
  };

  mainLoop();

  if (Config.debug) this.input.setOnDebug(mainLoop);

  if (!Config.debug && Config.limitFPS) setInterval(mainLoop, 1000 / Config.FPS);
}
