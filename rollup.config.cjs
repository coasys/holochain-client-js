const nodeResolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');

module.exports = {
  input: './lib/index.js',
  output: [
    {
      format: 'cjs',
      file: "lib/bundle.cjs",
    },
    {
      format: 'esm',
      file: "lib/bundle.js",
    }
  ],
  plugins: [
    nodeResolve(),
    commonjs()
  ]
};