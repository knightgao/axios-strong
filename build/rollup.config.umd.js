import base from './rollup.config.base';

const config = Object.assign({}, base, {
  output: {
    exports: 'named',
    name: 'vueLibs',
    file: 'dist/vueLibs.umd.js',
    format: 'umd'
  },
})
export default config;