import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import glsl from "vite-plugin-glsl";

export default defineConfig({
  plugins: [solid(), glsl()],
});

// ------------------------
// -- Single file config --
// ------------------------

// import { defineConfig } from "vite";
// import { viteSingleFile } from "vite-plugin-singlefile";
// import solid from "vite-plugin-solid";
// import glsl from "vite-plugin-glsl";
//
// export default defineConfig({
//   plugins: [viteSingleFile(), solid(), glsl()],
// });
