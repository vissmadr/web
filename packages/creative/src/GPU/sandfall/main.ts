import { WebGL } from "@utilities/webgl";
import { Random } from "@utilities/random";
import { Generator } from "./generator";
import { Config } from "./config";
import { Input } from "./input";

import computeVertex from "./shaders/compute/vertex.glsl";
import computeFragment from "./shaders/compute/fragment.glsl";
import renderVertex from "./shaders/render/vertex.glsl";
import renderFragment from "./shaders/render/fragment.glsl";

function setupGL(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl2");
  if (!gl) throw "Failed to get WebGL2 context";

  canvas.width = Config.width;
  canvas.height = Config.height;

  WebGL.Canvas.resizeToDisplaySize(canvas);

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.08, 0.08, 0.08, 1.0);

  return gl;
}

function setupPrograms(gl: WebGL2RenderingContext) {
  const computeVS = WebGL.Setup.compileShader(gl, "vertex", computeVertex);
  const computeFS = WebGL.Setup.compileShader(gl, "fragment", computeFragment);
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
      a_canvasVertices: gl.getAttribLocation(computeProgram, "a_canvasVertices"),

      u_inputTexture0: gl.getUniformLocation(computeProgram, "u_inputTexture0"),
      u_inputTexture1: gl.getUniformLocation(computeProgram, "u_inputTexture1"),
      u_inputTexture2: gl.getUniformLocation(computeProgram, "u_inputTexture2"),

      u_time: gl.getUniformLocation(computeProgram, "u_time"),
      u_random: gl.getUniformLocation(computeProgram, "u_random"),

      u_inputKey: gl.getUniformLocation(computeProgram, "u_inputKey"),
      u_spawnerSize: gl.getUniformLocation(computeProgram, "u_spawnerSize"),
      u_isPointerDown: gl.getUniformLocation(computeProgram, "u_isPointerDown"),
      u_pointerPosition: gl.getUniformLocation(computeProgram, "u_pointerPosition"),

      u_soakPerAbsorb: gl.getUniformLocation(computeProgram, "u_soakPerAbsorb"),
      u_maxSoakedCells: gl.getUniformLocation(computeProgram, "u_maxSoakedCells"),

      u_temperatureAbsoluteZero: gl.getUniformLocation(computeProgram, "u_temperatureAbsoluteZero"),
      u_temperatureWaterFreeze: gl.getUniformLocation(computeProgram, "u_temperatureWaterFreeze"),
      u_temperatureNormal: gl.getUniformLocation(computeProgram, "u_temperatureNormal"),
      u_temperatureWaterBoil: gl.getUniformLocation(computeProgram, "u_temperatureWaterBoil"),
      u_temperatureWoodBurn: gl.getUniformLocation(computeProgram, "u_temperatureWoodBurn"),
      u_temperatureMetalMelt: gl.getUniformLocation(computeProgram, "u_temperatureMetalMelt"),
      u_temperatureSandMelt: gl.getUniformLocation(computeProgram, "u_temperatureSandMelt"),
      u_temperatureMaximum: gl.getUniformLocation(computeProgram, "u_temperatureMaximum"),

      u_temperatureSpawnDebug: gl.getUniformLocation(computeProgram, "u_temperatureSpawnDebug"),
      u_temperatureSpawnEmpty: gl.getUniformLocation(computeProgram, "u_temperatureSpawnEmpty"),
      u_temperatureSpawnBlock: gl.getUniformLocation(computeProgram, "u_temperatureSpawnBlock"),
      u_temperatureSpawnSand: gl.getUniformLocation(computeProgram, "u_temperatureSpawnSand"),
      u_temperatureSpawnWater: gl.getUniformLocation(computeProgram, "u_temperatureSpawnWater"),
      u_temperatureSpawnIce: gl.getUniformLocation(computeProgram, "u_temperatureSpawnIce"),
      u_temperatureSpawnSteam: gl.getUniformLocation(computeProgram, "u_temperatureSpawnSteam"),
      u_temperatureSpawnFire: gl.getUniformLocation(computeProgram, "u_temperatureSpawnFire"),

      u_maxThermalTransferDebug: gl.getUniformLocation(computeProgram, "u_maxThermalTransferDebug"),
      u_maxThermalTransferEmpty: gl.getUniformLocation(computeProgram, "u_maxThermalTransferEmpty"),
      u_maxThermalTransferBlock: gl.getUniformLocation(computeProgram, "u_maxThermalTransferBlock"),
      u_maxThermalTransferSand: gl.getUniformLocation(computeProgram, "u_maxThermalTransferSand"),
      u_maxThermalTransferWater: gl.getUniformLocation(computeProgram, "u_maxThermalTransferWater"),
      u_maxThermalTransferIce: gl.getUniformLocation(computeProgram, "u_maxThermalTransferIce"),
      u_maxThermalTransferSteam: gl.getUniformLocation(computeProgram, "u_maxThermalTransferSteam"),
      u_maxThermalTransferFire: gl.getUniformLocation(computeProgram, "u_maxThermalTransferFire"),

      u_densityDebug: gl.getUniformLocation(computeProgram, "u_densityDebug"),
      u_densityEmpty: gl.getUniformLocation(computeProgram, "u_densityEmpty"),
      u_densityBlock: gl.getUniformLocation(computeProgram, "u_densityBlock"),
      u_densitySand: gl.getUniformLocation(computeProgram, "u_densitySand"),
      u_densityWater: gl.getUniformLocation(computeProgram, "u_densityWater"),
      u_densityIce: gl.getUniformLocation(computeProgram, "u_densityIce"),
      u_densitySteam: gl.getUniformLocation(computeProgram, "u_densitySteam"),
      u_densityFire: gl.getUniformLocation(computeProgram, "u_densityFire"),

      u_spreadDebug: gl.getUniformLocation(computeProgram, "u_spreadDebug"),
      u_spreadEmpty: gl.getUniformLocation(computeProgram, "u_spreadEmpty"),
      u_spreadBlock: gl.getUniformLocation(computeProgram, "u_spreadBlock"),
      u_spreadSand: gl.getUniformLocation(computeProgram, "u_spreadSand"),
      u_spreadWater: gl.getUniformLocation(computeProgram, "u_spreadWater"),
      u_spreadIce: gl.getUniformLocation(computeProgram, "u_spreadIce"),
      u_spreadSteam: gl.getUniformLocation(computeProgram, "u_spreadSteam"),
      u_spreadFire: gl.getUniformLocation(computeProgram, "u_spreadFire"),
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

  gl.useProgram(computeProgram);
  gl.uniform1i(locations.compute.u_inputTexture0, 0);
  gl.uniform1i(locations.compute.u_inputTexture1, 1);
  gl.uniform1i(locations.compute.u_inputTexture2, 2);
  gl.uniform1i(locations.compute.u_soakPerAbsorb, Config.soakPerAbsorb);
  gl.uniform1i(locations.compute.u_maxSoakedCells, Config.maxSoakedCells);
  gl.uniform1i(locations.compute.u_temperatureAbsoluteZero, Config.temperature.absoluteZero);
  gl.uniform1i(locations.compute.u_temperatureWaterFreeze, Config.temperature.waterFreeze);
  gl.uniform1i(locations.compute.u_temperatureNormal, Config.temperature.normal);
  gl.uniform1i(locations.compute.u_temperatureWaterBoil, Config.temperature.waterBoil);
  gl.uniform1i(locations.compute.u_temperatureWoodBurn, Config.temperature.woodBurn);
  gl.uniform1i(locations.compute.u_temperatureMetalMelt, Config.temperature.metalMelt);
  gl.uniform1i(locations.compute.u_temperatureSandMelt, Config.temperature.sandMelt);
  gl.uniform1i(locations.compute.u_temperatureMaximum, Config.temperature.maximum);
  gl.uniform1i(locations.compute.u_temperatureSpawnDebug, Config.temperatureSpawn.debug);
  gl.uniform1i(locations.compute.u_temperatureSpawnEmpty, Config.temperatureSpawn.empty);
  gl.uniform1i(locations.compute.u_temperatureSpawnBlock, Config.temperatureSpawn.block);
  gl.uniform1i(locations.compute.u_temperatureSpawnSand, Config.temperatureSpawn.sand);
  gl.uniform1i(locations.compute.u_temperatureSpawnWater, Config.temperatureSpawn.water);
  gl.uniform1i(locations.compute.u_temperatureSpawnIce, Config.temperatureSpawn.ice);
  gl.uniform1i(locations.compute.u_temperatureSpawnSteam, Config.temperatureSpawn.steam);
  gl.uniform1i(locations.compute.u_temperatureSpawnFire, Config.temperatureSpawn.fire);
  gl.uniform1i(locations.compute.u_maxThermalTransferDebug, Config.maxThermalTransfer.debug);
  gl.uniform1i(locations.compute.u_maxThermalTransferEmpty, Config.maxThermalTransfer.empty);
  gl.uniform1i(locations.compute.u_maxThermalTransferBlock, Config.maxThermalTransfer.block);
  gl.uniform1i(locations.compute.u_maxThermalTransferSand, Config.maxThermalTransfer.sand);
  gl.uniform1i(locations.compute.u_maxThermalTransferWater, Config.maxThermalTransfer.water);
  gl.uniform1i(locations.compute.u_maxThermalTransferIce, Config.maxThermalTransfer.ice);
  gl.uniform1i(locations.compute.u_maxThermalTransferSteam, Config.maxThermalTransfer.steam);
  gl.uniform1i(locations.compute.u_maxThermalTransferFire, Config.maxThermalTransfer.fire);
  gl.uniform1i(locations.compute.u_densityDebug, Config.density.debug);
  gl.uniform1i(locations.compute.u_densityEmpty, Config.density.empty);
  gl.uniform1i(locations.compute.u_densityBlock, Config.density.block);
  gl.uniform1i(locations.compute.u_densitySand, Config.density.sand);
  gl.uniform1i(locations.compute.u_densityWater, Config.density.water);
  gl.uniform1i(locations.compute.u_densityIce, Config.density.ice);
  gl.uniform1i(locations.compute.u_densitySteam, Config.density.steam);
  gl.uniform1i(locations.compute.u_densityFire, Config.density.fire);
  gl.uniform1i(locations.compute.u_spreadDebug, Config.spread.debug);
  gl.uniform1i(locations.compute.u_spreadEmpty, Config.spread.empty);
  gl.uniform1i(locations.compute.u_spreadBlock, Config.spread.block);
  gl.uniform1i(locations.compute.u_spreadSand, Config.spread.sand);
  gl.uniform1i(locations.compute.u_spreadWater, Config.spread.water);
  gl.uniform1i(locations.compute.u_spreadIce, Config.spread.ice);
  gl.uniform1i(locations.compute.u_spreadSteam, Config.spread.steam);
  gl.uniform1i(locations.compute.u_spreadFire, Config.spread.fire);

  gl.useProgram(renderProgram);
  gl.uniform1i(locations.render.uOutputTexture0, 0);
  gl.uniform1i(locations.render.uOutputTexture1, 1);
  gl.uniform1i(locations.render.uOutputTexture2, 2);
  gl.uniform1i(locations.render.uMaxSoakedCells, Config.maxSoakedCells);
  gl.uniform1i(locations.render.uSoakPerAbsorb, Config.soakPerAbsorb);
  gl.uniform1f(locations.render.uCanvas, Config.width);
  gl.uniform1f(locations.render.uColumns, Config.columns);
  gl.uniform1f(locations.render.uBorderSize, Config.borderSize);

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
  gl.enableVertexAttribArray(locations.compute.a_canvasVertices);
  gl.vertexAttribPointer(locations.compute.a_canvasVertices, 2, gl.FLOAT, false, 0, 0);

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

export function main(canvas: HTMLCanvasElement) {
  const gl = setupGL(canvas);

  Input.setup(canvas);

  const programs = setupPrograms(gl);

  const { locations, vertexArrayObjects, textures, framebuffers } = setupState(gl, programs.compute, programs.render);

  let time: number = 0;
  const computeLoop = () => {
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

    gl.useProgram(programs.compute);
    gl.bindVertexArray(vertexArrayObjects.update);

    gl.uniform1i(locations.compute.u_time, time);
    gl.uniform1i(locations.compute.u_random, Random.rangeInt(0, 65000));
    gl.uniform1i(locations.compute.u_inputKey, Input.getSpawnKey());
    gl.uniform1f(locations.compute.u_spawnerSize, Config.spawnerSize);
    gl.uniform1i(locations.compute.u_isPointerDown, Number(Input.getIsPointerDown()));
    gl.uniform2f(locations.compute.u_pointerPosition, Input.getPointerX(), Input.getPointerY());

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };

  const renderLoop = () => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textures.aux0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, textures.aux1);

    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, textures.aux2);

    gl.useProgram(programs.render);
    gl.bindVertexArray(vertexArrayObjects.render);

    gl.drawArrays(gl.POINTS, 0, Config.columns ** 2);
  };

  const loop = () => {
    computeLoop();
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

    if (!Config.debug && !Config.limitFPS) requestAnimationFrame(loop);
  };

  requestAnimationFrame(loop);

  if (Config.debug) Input.setOnDebug(loop);

  if (!Config.debug && Config.limitFPS) setInterval(loop, 1000 / Config.FPS);
}
