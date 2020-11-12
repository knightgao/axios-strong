import base from './rollup.config.base';

const config = Object.assign({}, base, {
  output: {
    exports: 'named',
    name: 'vueLibs',
    file: 'dist/vueLibs.esm.js',
    format: 'es'
  },
})
export default config;