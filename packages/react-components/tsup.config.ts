import { Options } from "tsup";

const options: Options = {
  format: ["cjs", "esm"], // generate cjs and esm files
  clean: false,
  splitting: false,
  dts: true,
  entryPoints: ["index.tsx", "src/next/server.ts", "src/next/client.ts"],
  minify: true,
  sourcemap: true,
  target: "es2020",
};

export default options;
