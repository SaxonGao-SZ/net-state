var rollup = require('rollup')
var resolve = require('rollup-plugin-node-resolve');
var babel = require('rollup-plugin-babel');
var wOptions = { 
  input: 'src/index.js',
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**',
      babelrc: false,
      presets: [
        '@babel/preset-env',
        {
          //useBuiltIns: 'usage', 
          // corejs: 3,
          // modules: 'false',
        }
      ]
    })
],
  output: {
    name: 'net-state',
    file: 'dist/net-state.js',
    format: 'umd',
    sourceMap: 'inline',
  },  
  watch: {
    include: 'src/**'
  }
}
rollup.watch(wOptions);
export default wOptions;

