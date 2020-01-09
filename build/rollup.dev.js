var rupphtml = require('rollup-plugin-html')
var rollup = require('rollup')
var wOptions = { 
  input: 'src/index.js',
  output: {
    name: 'net-state',
    file: 'dist/anna.js',
    format: 'cjs',
    // format: 'iife',
    sourceMap: 'inline',
  },  
  watch: {
    include: 'src/**'
  }
}
rollup.watch(wOptions);
export default wOptions;

