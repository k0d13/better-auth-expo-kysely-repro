import { build } from "esbuild";

const { metafile } = await build({
  entryPoints: ["index.js"],
  outdir: "dist",
  bundle: true,
  format: "esm",
  splitting: true,
  metafile: true,
  logLevel: "silent",
});

for (const [file, { bytes }] of Object.entries(metafile.outputs)) {
  console.log(`${file} ${bytes}`);
}
