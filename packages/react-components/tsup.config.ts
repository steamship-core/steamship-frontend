import { Options } from "tsup";

const options: Options = {
  format: ["cjs", "esm"],
  clean: true,
  splitting: false,
  dts: true,
  entryPoints: ["index.tsx"],
  minify: true,
  sourcemap: true,
  target: "es2015",
};

export default options;
