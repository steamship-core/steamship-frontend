import { Options } from "tsup";

const options: Options = {
  format: ["cjs", "esm"], // generate cjs and esm files
  clean: false,
  splitting: false,
  dts: true,
  entry: {
    index: "index.ts",
  },
  minify: false,
  sourcemap: true,
  target: "es2020",
};

export default options;
