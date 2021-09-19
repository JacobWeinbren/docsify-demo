import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import postcss from "rollup-plugin-postcss";
import autoprefixer from "autoprefixer";
import babel from "@rollup/plugin-babel";
import esbuild from "rollup-plugin-esbuild";

const production = !process.env.ROLLUP_WATCH;

export default {
    input: "src/index.js",
    output: {
        file: "dist/index.min.js",
        format: "iife",
        sourcemap: true,
        name: "docsifyDemo",
    },
    plugins: [
        //Backwards compatibility
        commonjs(),
        babel({
            babelHelpers: "bundled",
            babelrc: false,
            ...{
                presets: [
                    [
                        "@babel/preset-env",
                        {
                            useBuiltIns: "entry",
                            corejs: "3.8",
                        },
                    ],
                ],
            },
        }),
        //Main functions
        postcss({
            extract: "index.min.css",
            minimize: true,
            plugins: [autoprefixer()],
        }),
        resolve(),
        esbuild({
            minify: production === true,
        }),
    ],
};
