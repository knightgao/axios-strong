# Libs

axios 的扩展,使得他支持缓存



使用例子
const myaxios = axios.create({
  baseURL: base,
  timeout: 10000, // 请求超时时间
  adapter: cacheAdapterEnhancer(axios.defaults.adapter, {
    enabledByDefault: false, // 默认是否走缓存
    cacheFlag: "cache", //默认的Flag
    maxAge: 5 * 60 * 1000, // 缓存过期时间
    max: 100 //最多允许的缓存
  })
});