import { Options } from "tsup";

const options: Options = {
  format: ["cjs", "esm"], // generate cjs and esm files
  clean: true,
  splitting: false,
  dts: true,
  entryPoints: ["index.tsx", "next.tsx"],
  minify: true,
  sourcemap: true,
  target: "es2020",
};

export default options;
