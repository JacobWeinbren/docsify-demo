const esbuild = require('esbuild');
const sassPlugin = require('esbuild-sass-plugin').sassPlugin;

//On Watch
if (process.env.debug == "true") {
    var watch = {
        onRebuild(error, result) {
            if (error) console.error("Watch Build Failed:", error);
            else console.log("Watch Build Succeeded:", result);
        },
    };
} else {
    var watch = false;
}

esbuild.build({
    entryPoints: ['src/index.js'],
    bundle: true,
    minify: true,
    outfile: 'dist/index.min.js',
    plugins: [sassPlugin()],
    watch: watch
}).catch((e) => console.error(e.message))