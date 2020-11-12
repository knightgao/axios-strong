import LRUCache from 'lru-cache';
export { default as Cache } from 'lru-cache';
import 'axios';
import buildURL from 'axios/lib/helpers/buildURL';

function buildSortedURL(...args) {
  const builtURL = buildURL(...args);
  const [urlPath, queryString] = builtURL.split('?');

  if (queryString) {
    const paramsPair = queryString.split('&');
    return `${urlPath}?${paramsPair.sort().join('&')}`;
  }

  return builtURL;
}

function isCacheLike(cache) {
  return !!(cache.set && cache.get && cache.del && typeof cache.get === 'function' && typeof cache.set === 'function' && typeof cache.del === 'function');
}

// 	interface AxiosRequestConfig {
// 		forceUpdate?: boolean;
// 		cache?: boolean | ICacheLike<any>;
// 	}
// }

const FIVE_MINUTES = 1000 * 60 * 5;
const CAPACITY = 100;
/**
 *
 * @param {*} adapter
 * @param {*} options
 * @returns {AxiosAdapter}
 */

function cacheAdapterEnhancer(adapter, options = {}) {
  const Temp = {
    enabledByDefault: options && options.enabledByDefault ? true : false,
    cacheFlag: options && options.cacheFlag ? options.cacheFlag : "cache",
    defaultCache: new LRUCache({
      maxAge: options && options.maxAge ? options.maxAge : FIVE_MINUTES,
      max: options && options.max ? options.max : CAPACITY
    })
  };
  const {
    enabledByDefault = true,
    cacheFlag = "cache",
    defaultCache = new LRUCache({
      maxAge: FIVE_MINUTES,
      max: CAPACITY
    })
  } = Temp;
  return config => {
    const {
      url,
      method,
      params,
      headers,
      paramsSerializer,
      forceUpdate
    } = config;
    const useCache = config[cacheFlag] !== void 0 && config[cacheFlag] !== null ? config[cacheFlag] : enabledByDefault;

    if (method === "get" && useCache) {
      // if had provide a specified cache, then use it instead
      const cache = isCacheLike(useCache) ? useCache : defaultCache; // build the index according to the url and params

      const index = buildSortedURL(url, { ...params,
        token: headers["token"] || ""
      }, paramsSerializer);
      let responsePromise = cache.get(index);

      if (!responsePromise || forceUpdate) {
        responsePromise = (async () => {
          try {
            return await adapter(config);
          } catch (reason) {
            cache.del(index);
            throw reason;
          }
        })(); // put the promise for the non-transformed response into cache as a placeholder


        cache.set(index, responsePromise);
        return responsePromise;
      }
      /* istanbul ignore next */


      if (process.env.LOGGER_LEVEL === "info") {
        // eslint-disable-next-line no-console
        console.info(`[axios-extensions] request cached by cache adapter --> url: ${index}`);
      }

      return responsePromise;
    }

    return adapter(config);
  };
}

export { cacheAdapterEnhancer };
