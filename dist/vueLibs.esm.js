import 'axios';
import LRUCache from 'lru-cache';
import buildURL from 'axios/lib/helpers/buildURL';

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function buildSortedURL() {
  var builtURL = buildURL.apply(void 0, arguments);

  var _builtURL$split = builtURL.split('?'),
      _builtURL$split2 = _slicedToArray(_builtURL$split, 2),
      urlPath = _builtURL$split2[0],
      queryString = _builtURL$split2[1];

  if (queryString) {
    var paramsPair = queryString.split('&');
    return "".concat(urlPath, "?").concat(paramsPair.sort().join('&'));
  }

  return builtURL;
}

function isCacheLike(cache) {
  return !!(cache.set && cache.get && cache.del && typeof cache.get === 'function' && typeof cache.set === 'function' && typeof cache.del === 'function');
}

var FIVE_MINUTES = 1000 * 60 * 5;
var CAPACITY = 100;
/**
 *
 * @param {*} adapter
 * @param {*} options
 * @returns {AxiosAdapter}
 */

function cacheAdapterEnhancer(adapter) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var Temp = {
    enabledByDefault: options && options.enabledByDefault ? true : false,
    cacheFlag: options && options.cacheFlag ? options.cacheFlag : "cache",
    defaultCache: new LRUCache({
      maxAge: options && options.maxAge ? options.maxAge : FIVE_MINUTES,
      max: options && options.max ? options.max : CAPACITY
    })
  };
  var _Temp$enabledByDefaul = Temp.enabledByDefault,
      enabledByDefault = _Temp$enabledByDefaul === void 0 ? true : _Temp$enabledByDefaul,
      _Temp$cacheFlag = Temp.cacheFlag,
      cacheFlag = _Temp$cacheFlag === void 0 ? "cache" : _Temp$cacheFlag,
      _Temp$defaultCache = Temp.defaultCache,
      defaultCache = _Temp$defaultCache === void 0 ? new LRUCache({
    maxAge: FIVE_MINUTES,
    max: CAPACITY
  }) : _Temp$defaultCache;
  return function (config) {
    var url = config.url,
        method = config.method,
        params = config.params,
        headers = config.headers,
        paramsSerializer = config.paramsSerializer,
        forceUpdate = config.forceUpdate;
    var useCache = config[cacheFlag] !== void 0 && config[cacheFlag] !== null ? config[cacheFlag] : enabledByDefault;

    if (method === "get" && useCache) {
      // if had provide a specified cache, then use it instead
      var cache = isCacheLike(useCache) ? useCache : defaultCache; // build the index according to the url and params

      var index = buildSortedURL(url, _objectSpread2(_objectSpread2({}, params), {}, {
        token: headers["token"] || ""
      }), paramsSerializer);
      var responsePromise = cache.get(index);

      if (!responsePromise || forceUpdate) {
        responsePromise = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.prev = 0;
                  _context.next = 3;
                  return adapter(config);

                case 3:
                  return _context.abrupt("return", _context.sent);

                case 6:
                  _context.prev = 6;
                  _context.t0 = _context["catch"](0);
                  cache.del(index);
                  throw _context.t0;

                case 10:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, null, [[0, 6]]);
        }))(); // put the promise for the non-transformed response into cache as a placeholder

        cache.set(index, responsePromise);
        return responsePromise;
      }
      /* istanbul ignore next */


      if (process.env.LOGGER_LEVEL === "info") {
        // eslint-disable-next-line no-console
        console.info("[axios-extensions] request cached by cache adapter --> url: ".concat(index));
      }

      return responsePromise;
    }

    return adapter(config);
  };
}

export { cacheAdapterEnhancer };
