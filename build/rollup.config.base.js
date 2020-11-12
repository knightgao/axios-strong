// import resolve from "rollup-plugin-node-resolve"; // 告诉 Rollup 如何查找外部模块
import commonjs from "@rollup/plugin-commonjs"; // 将CommonJS模块转换为 ES2015 供 Rollup 处理
// import vue from 'rollup-plugin-vue' // 处理vue文件
import babel from "@rollup/plugin-babel"; // rollup 的 babel 插件，ES6转ES5
// import json from "@rollup/plugin-json";

export default {
  input: "src/index.js", //入口
  plugins: [commonjs(), babel({ babelHelpers: "bundled" })],
};
