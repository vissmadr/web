import { WebGL } from "@utilities/webgl";

import vertex from "./vertex.glsl";
import fragment from "./fragment.glsl";

import img0 from "./layer0.png";
import img1 from "./layer1.png";
import img2 from "./layer2.png";
import img3 from "./layer3.png";

const defaultConfig = {
  width: 600,
  height: 600,
};

type Config = typeof defaultConfig;

let config: Config;

let pointerX: number = 0;
let pointerY: number = 0;

function setupPointer(onMove: () => void, canvas: HTMLCanvasElement) {
  const handler = (ev: MouseEvent) => {
    const canvasBounds = canvas.getBoundingClientRect();
    pointerX = ev.clientX - canvasBounds.left;
    pointerY = ev.clientY - canvasBounds.top;
    onMove();
  };
  canvas.addEventListener("mousemove", handler);
  return () => {
    canvas.removeEventListener("mousemove", handler);
  };
}

function loadImage(source: string, onLoad: () => void) {
  const image = new Image();
  image.src = source;
  image.onload = onLoad;
  return image;
}

function loadImages(sources: string[], target: HTMLImageElement[], onAllLoaded: () => void) {
  let toLoadCount = sources.length;

  const onImageLoaded = () => {
    toLoadCount--;
    if (toLoadCount <= 0) onAllLoaded();
  };

  for (let i = 0; i < sources.length; i++) {
    const image = loadImage(sources[i], onImageLoaded);
    target.push(image);
  }
}

function setupGL(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl2", { alpha: false, antialias: false, powerPreference: "high-performance" });
  if (!gl) throw new Error("Failed to get WebGL2 context");

  canvas.width = config.width;
  canvas.height = config.height;

  WebGL.Canvas.resizeToDisplaySize(gl.canvas as HTMLCanvasElement);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  return gl;
}

function setupProgram(gl: WebGL2RenderingContext) {
  const vertexShader = WebGL.Setup.compileShader(gl, "vertex", vertex);
  const fragmentShader = WebGL.Setup.compileShader(gl, "fragment", fragment);
  const program = WebGL.Setup.linkProgram(gl, vertexShader, fragmentShader);
  return program;
}

function setupUniforms(gl: WebGL2RenderingContext, program: WebGLProgram) {
  return {
    u_resolution: gl.getUniformLocation(program, "u_resolution"),
    u_pointer: gl.getUniformLocation(program, "u_pointer"),
    u_image0: gl.getUniformLocation(program, "u_image0"),
    u_image1: gl.getUniformLocation(program, "u_image1"),
    u_image2: gl.getUniformLocation(program, "u_image2"),
    u_image3: gl.getUniformLocation(program, "u_image3"),
  } as const;
}

function setupState(gl: WebGL2RenderingContext, program: WebGLProgram, images: HTMLImageElement[]) {
  const attributes = {
    a_position: gl.getAttribLocation(program, "a_position"),
    a_textureCoordinates: gl.getAttribLocation(program, "a_textureCoordinates"),
  } as const;

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const positionBuffer = gl.createBuffer();
  const textureCoordinatesBuffer = gl.createBuffer();
  const textures: WebGLTexture[] = [];
  // aPosition
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(WebGL.Points.rectangle(0, 0, gl.canvas.width, gl.canvas.height)),
    gl.STATIC_DRAW,
  );
  gl.enableVertexAttribArray(attributes.a_position);
  gl.vertexAttribPointer(attributes.a_position, 2, gl.FLOAT, false, 0, 0);

  // aTextureCoordinates
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordinatesBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(WebGL.Points.rectangle(0, 0, 1, 1)), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(attributes.a_textureCoordinates);
  gl.vertexAttribPointer(attributes.a_textureCoordinates, 2, gl.FLOAT, false, 0, 0);

  // Texture.
  for (let i = 0; i < 4; i++) {
    gl.activeTexture(gl.TEXTURE0 + i);

    const texture = gl.createTexture();
    if (!texture) throw new Error("Failed to create texture");
    textures.push(texture);

    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images[i]);
  }

  return { vao, positionBuffer, textureCoordinatesBuffer, textures } as const;
}

export function main(canvas: HTMLCanvasElement, settings: Partial<Config> = {}): () => void {
  config = { ...defaultConfig, ...settings };

  const sources = [img0, img1, img2, img3];
  const images: HTMLImageElement[] = [];

  let cleanupPointer: (() => void) | undefined;
  let gl: WebGL2RenderingContext | undefined;
  let program: WebGLProgram | undefined;
  let resources: ReturnType<typeof setupState> | undefined;

  loadImages(sources, images, () => {
    gl = setupGL(canvas);
    program = setupProgram(gl);
    const uniforms = setupUniforms(gl, program);
    resources = setupState(gl, program, images);

    gl.useProgram(program);
    gl.bindVertexArray(resources.vao);

    gl.uniform2f(uniforms.u_resolution, gl.canvas.width, gl.canvas.height);
    gl.uniform1i(uniforms.u_image0, 0);
    gl.uniform1i(uniforms.u_image1, 1);
    gl.uniform1i(uniforms.u_image2, 2);
    gl.uniform1i(uniforms.u_image3, 3);

    const render = () => {
      gl!.uniform2f(uniforms.u_pointer, pointerX, canvas.height - pointerY);
      gl!.drawArrays(gl!.TRIANGLES, 0, 6);
    };

    render();

    cleanupPointer = setupPointer(render, canvas);
  });

  return () => {
    cleanupPointer?.();
    if (gl) {
      if (program) gl.deleteProgram(program);
      if (resources) {
        gl.deleteVertexArray(resources.vao);
        gl.deleteBuffer(resources.positionBuffer);
        gl.deleteBuffer(resources.textureCoordinatesBuffer);
        for (const texture of resources.textures) gl.deleteTexture(texture);
      }
    }
  };
}
