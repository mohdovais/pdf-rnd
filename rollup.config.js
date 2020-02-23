import { terser } from "rollup-plugin-terser";
import buble from "rollup-plugin-buble";

export default [
  {
    input: "src/main.js",
    output: {
      sourcemap: true,
      format: "esm",
      file: "build/bundle.esm.js"
    },
    plugins: [terser()]
  },
  {
    input: "src/main.js",
    output: {
      sourcemap: true,
      format: "umd",
      name: "PDFText",
      file: "build/bundle.umd.js"
    },
    plugins: [buble(), terser()]
  }
];
