import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";

// rollup.config.js
const inputSrc = [
  ["./src/index.ts", "es"],
  ["./src/index.ts", "cjs"],
];

const extensions = [".js", ".jsx", ".ts", ".tsx", ".scss"];

export default inputSrc.map(([input, format]) => {
  return {
    input,
    output: {
      dir: `dist/${format}`,
      format,
      exports: "auto",
    },
    external: [/@babel\/runtime/],
    preserveModules: format === "cjs",
    plugins: [
      babel({
        babelHelpers: "runtime",
        exclude: "node_modules/**",
        extensions,
        plugins: ["@babel/plugin-transform-runtime"],
        presets: [
          "@babel/typescript",
          "@babel/react",
          [
            "@babel/env",
            {
              targets: "> 0.25%, not dead",
            },
          ],
        ],
      }),
      resolve({
        extensions,
      }),
      // CommonJS 로 작성된 모듈들을 ES6 바꾸어서 rollup이 해석할 수 있게 도와줍니다.
      commonjs({
        extensions: [...extensions, ".js"],
      }),
      peerDepsExternal(),
      postcss({
        extensions: [".css", ".scss", ".sass"],
      }),
    ],
  };
});
