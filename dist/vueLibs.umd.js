(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('lru-cache'), require('axios'), require('axios/lib/helpers/buildURL')) :
	typeof define === 'function' && define.amd ? define(['exports', 'lru-cache', 'axios', 'axios/lib/helpers/buildURL'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.vueLibs = {}, global.LRUCache, null, global.buildURL));
}(this, (function (exports, LRUCache, axios, buildURL) { 'use strict';

	function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

	var LRUCache__default = /*#__PURE__*/_interopDefaultLegacy(LRUCache);
	var buildURL__default = /*#__PURE__*/_interopDefaultLegacy(buildURL);

	function buildSortedURL(...args) {
	  const builtURL = buildURL__default['default'](...args);
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
	    defaultCache: new LRUCache__default['default']({
	      maxAge: options && options.maxAge ? options.maxAge : FIVE_MINUTES,
	      max: options && options.max ? options.max : CAPACITY
	    })
	  };
	  const {
	    enabledByDefault = true,
	    cacheFlag = "cache",
	    defaultCache = new LRUCache__default['default']({
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

	Object.defineProperty(exports, 'Cache', {
		enumerable: true,
		get: function () {
			return LRUCache__default['default'];
		}
	});
	exports.cacheAdapterEnhancer = cacheAdapterEnhancer;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
