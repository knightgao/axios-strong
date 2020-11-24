# @devgaoy/axios-strong

axios 的扩展,使得他支持缓存

## Installing

```bash
npm i @devgaoy/axios-strong -S
```

使用例子

```javascript
import { cacheAdapterEnhancer } from "@devgaoy/axios-strong";
const myaxios = axios.create({
  baseURL: base,
  timeout: 10000, // 请求超时时间
  adapter: cacheAdapterEnhancer(axios.defaults.adapter, {
    enabledByDefault: false, // 默认是否走缓存
    cacheFlag: "cache", //默认的Flag
    maxAge: 5 * 60 * 1000, // 缓存过期时间
    max: 100, //最多允许的缓存
  }),
});
```

```javascript
myaxios.get("/users", { cache: true }); // 发请求了
myaxios.get("/users", { cache: true }); // 没法请求，走了缓存
myaxios.get("/users", { cache: false }); // 不走缓存 发了请求
```

**Heavily inspired by [axios-extensions](https://github.com/kuitos/axios-extensions)**
