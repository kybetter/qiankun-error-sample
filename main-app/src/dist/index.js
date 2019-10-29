'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _isFunction = _interopDefault(require('lodash/isFunction'));
var importHtmlEntry = require('import-html-entry');
var singleSpa = require('single-spa');
var _noop = _interopDefault(require('lodash/noop'));

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

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

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

/**
 * 预加载静态资源，不兼容 requestIdleCallback 的浏览器不做任何动作
 * @param entry
 * @param fetch
 */

function prefetch(entry, fetch) {
  var requestIdleCallback = window.requestIdleCallback || _noop;
  requestIdleCallback(
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var _ref2, getExternalScripts, getExternalStyleSheets;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return importHtmlEntry.importEntry(entry, {
              fetch: fetch
            });

          case 2:
            _ref2 = _context.sent;
            getExternalScripts = _ref2.getExternalScripts;
            getExternalStyleSheets = _ref2.getExternalStyleSheets;
            requestIdleCallback(getExternalStyleSheets);
            requestIdleCallback(getExternalScripts);

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
}
function prefetchAfterFirstMounted(apps, fetch) {
  window.addEventListener('single-spa:first-mount', function () {
    var mountedApps = singleSpa.getMountedApps();
    var notMountedApps = apps.filter(function (app) {
      return mountedApps.indexOf(app.name) === -1;
    });

    if (process.env.NODE_ENV === 'development') {
      console.log('prefetch starting...', notMountedApps);
    }

    notMountedApps.forEach(function (app) {
      return prefetch(app.entry, fetch);
    });
  }, {
    once: true
  });
}

function hijack() {
  var rawHtmlAppendChild = HTMLHeadElement.prototype.appendChild;
  var dynamicStyleSheets = [];

  HTMLHeadElement.prototype.appendChild = function appendChild(newChild) {
    // hijack dynamic style injection
    if (newChild.tagName && (newChild.tagName === 'LINK' || newChild.tagName === 'STYLE')) {
      dynamicStyleSheets.push(newChild);
    }

    return rawHtmlAppendChild.call(this, newChild);
  };

  return function free() {
    HTMLHeadElement.prototype.appendChild = rawHtmlAppendChild;
    dynamicStyleSheets.forEach(function (stylesheet) {
      return document.head.removeChild(stylesheet);
    });
    return function rebuild() {
      dynamicStyleSheets.forEach(function (stylesheet) {
        return document.head.appendChild(stylesheet);
      }); // for gc

      dynamicStyleSheets = [];
    };
  };
}

function hijack$1() {
  // FIXME umi unmount feature request
  // @see http://gitlab.alipay-inc.com/bigfish/bigfish/issues/1154
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  var rawHistoryListen = function rawHistoryListen(_) {
    return _noop;
  };

  var historyListeners = [];
  var historyUnListens = [];

  if (window.g_history && _isFunction(window.g_history.listen)) {
    rawHistoryListen = window.g_history.listen.bind(window.g_history);

    window.g_history.listen = function (listener) {
      historyListeners.push(listener);
      var unListen = rawHistoryListen(listener);
      historyUnListens.push(unListen);
      return function () {
        unListen();
        historyUnListens.splice(historyUnListens.indexOf(unListen), 1);
        historyListeners.splice(historyListeners.indexOf(listener), 1);
      };
    };
  }

  return function free() {
    var rebuild = _noop;
    /*
     还存在余量 listener 表明未被卸载，存在两种情况
     1. 应用在 unmout 时未正确卸载 listener
     2. listener 是应用 mount 之前绑定的，
     第二种情况下应用在下次 mount 之前需重新绑定该 listener
     */

    if (historyListeners.length) {
      rebuild = function rebuild() {
        // 必须使用 window.g_history.listen 的方式重新绑定 listener，从而能保证 rebuild 这部分也能被捕获到，否则在应用卸载后无法正确的移除这部分副作用
        historyListeners.forEach(function (listener) {
          return window.g_history.listen(listener);
        });
      };
    } // 卸载余下的 listener


    historyUnListens.forEach(function (unListen) {
      return unListen();
    }); // restore

    if (window.g_history && _isFunction(window.g_history.listen)) {
      window.g_history.listen = rawHistoryListen;
    }

    return rebuild;
  };
}

/**
 * @author Kuitos
 * @since 2019-05-15
 */
function sleep(_x) {
  return _sleep.apply(this, arguments);
}

function _sleep() {
  _sleep = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(ms) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", new Promise(function (resolve) {
              return setTimeout(resolve, ms);
            }));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _sleep.apply(this, arguments);
}

function isConstructable(fn) {
  var constructableFunctionRegex = /^function\b\s[A-Z].*/;
  var classRegex = /^class\b/; // 有 prototype 并且 prototype 上有定义一系列非 constructor 属性，则可以认为是一个构造函数

  return fn.prototype && Object.getOwnPropertyNames(fn.prototype).filter(function (k) {
    return k !== 'constructor';
  }).length || constructableFunctionRegex.test(fn.toString()) || classRegex.test(fn.toString());
}

function hijack$2() {
  var rawWindowInterval = window.setInterval;
  var rawWindowTimeout = window.setTimeout;
  var timerIds = [];
  var intervalIds = [];

  window.setInterval = function () {
    // @ts-ignore
    var intervalId = rawWindowInterval.apply(void 0, arguments);
    intervalIds.push(intervalId);
    return intervalId;
  };

  window.setTimeout = function () {
    // @ts-ignore
    var timerId = rawWindowTimeout.apply(void 0, arguments);
    timerIds.push(timerId);
    return timerId;
  };

  return function free() {
    window.setInterval = rawWindowInterval;
    window.setTimeout = rawWindowTimeout;
    timerIds.forEach(
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(id) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return sleep(500);

              case 2:
                window.clearTimeout(id);

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());
    intervalIds.forEach(function (id) {
      window.clearInterval(id);
    });
    return _noop;
  };
}

function hijack$3() {
  var listenerMap = new Map();
  var rawAddEventListener = window.addEventListener;
  var rawRemoveEventListener = window.removeEventListener;

  window.addEventListener = function (type, listener, options) {
    var listeners = listenerMap.get(type) || [];
    listenerMap.set(type, [].concat(_toConsumableArray(listeners), [listener]));
    return rawAddEventListener.call(window, type, listener, options);
  };

  window.removeEventListener = function (type, listener, options) {
    var storedTypeListeners = listenerMap.get(type);

    if (storedTypeListeners && storedTypeListeners.length && storedTypeListeners.indexOf(listener) !== -1) {
      storedTypeListeners.splice(storedTypeListeners.indexOf(listener), 1);
    }

    return rawRemoveEventListener.call(window, type, listener, options);
  };

  return function free() {
    listenerMap.forEach(function (listeners, type) {
      return _toConsumableArray(listeners).forEach(function (listener) {
        return window.removeEventListener(type, listener);
      });
    });
    window.addEventListener = rawAddEventListener;
    window.removeEventListener = rawRemoveEventListener;
    return _noop;
  };
}

/**
 * @author Kuitos
 * @since 2019-04-11
 */
function hijack$4() {
  return [hijack$2(), hijack$3(), hijack$1(), hijack()];
}

function snapshot(updatedPropsValueMap) {
  /*
   浅克隆一把
   这里是有问题的，理论上应该深克隆，但是深克隆因为不会共用引用，在某些代码里就跪了。。
   @see https://github.com/dvajs/dva/blob/master/packages/dva/src/index.js#L33-L78
   */
  var copyMap = new Map();
  updatedPropsValueMap.forEach(function (v, k) {
    return copyMap.set(k, v);
  });
  return copyMap;
}

function isPropConfigurable(target, prop) {
  var descriptor = Object.getOwnPropertyDescriptor(target, prop);
  return descriptor ? descriptor.configurable : true;
}

function setWindowProp(prop, value, toDelete) {
  if (value === undefined && toDelete) {
    delete window[prop];
  } else if (isPropConfigurable(window, prop) && _typeof(prop) !== 'symbol') {
    Object.defineProperty(window, prop, {
      writable: true,
      configurable: true
    });
    window[prop] = value;
  }
}
/**
 * 生成应用运行时沙箱
 *
 * 沙箱分两个类型：
 * 1. app 环境沙箱
 *  app 环境沙箱是指应用初始化过之后，应用会在什么样的上下文环境运行。每个应用的环境沙箱只会初始化一次，因为子应用只会触发一次 bootstrap 。
 *  子应用在切换时，实际上切换的是 app 环境沙箱。
 * 2. render 沙箱
 *  子应用在 app mount 开始前生成好的的沙箱。每次子应用切换过后，render 沙箱都会重现初始化。
 *
 * 这么设计的目的是为了保证每个子应用切换回来之后，还能运行在应用 bootstrap 之后的环境下。
 *
 * @param appName
 */


function genSandbox(appName) {
  // 沙箱期间新增的全局变量
  var addedPropsMapInSandbox = new Map(); // 沙箱期间更新的全局变量

  var modifiedPropsOriginalValueMapInSandbox = new Map(); // 持续记录更新的(新增和修改的)全局变量的 map，用于在任意时刻做 snapshot

  var currentUpdatedPropsValueMapForSnapshot = new Map();
  var freers = [];
  var sideEffectsRebuilders = []; // render 沙箱的上下文快照

  var renderSandboxSnapshot = null;
  var inAppSandbox = true;
  var boundValueSymbol = Symbol('bound value');
  var sandbox = new Proxy(window, {
    set: function set(target, p, value) {
      if (inAppSandbox) {
        if (!target.hasOwnProperty(p)) {
          addedPropsMapInSandbox.set(p, value);
        } else if (!modifiedPropsOriginalValueMapInSandbox.has(p)) {
          // 如果当前 window 对象存在该属性，且 record map 中未记录过，则记录该属性初始值
          var originalValue = target[p];
          modifiedPropsOriginalValueMapInSandbox.set(p, originalValue);
        }

        currentUpdatedPropsValueMapForSnapshot.set(p, value); // 必须重新设置 window 对象保证下次 get 时能拿到已更新的数据
        // eslint-disable-next-line no-param-reassign

        target[p] = value;
        return true;
      }

      if (process.env.NODE_ENV === 'development') {
        console.warn("Try to set window.".concat(p.toString(), " while js sandbox destroyed or not active in ").concat(appName, "!"));
      }

      return false;
    },
    get: function get(target, p) {
      var value = target[p];
      /*
      仅绑定 !isConstructable && isCallable 的函数对象，如 window.console、window.atob 这类。目前没有完美的检测方式，这里通过 prototype 中是否还有可枚举的拓展方法的方式来判断
      @warning 这里不要随意替换成别的判断方式，因为可能触发一些 edge case（比如在 lodash.isFunction 在 iframe 上下文中可能由于调用了 top window 对象触发的安全异常）
       */

      if (typeof value === 'function' && !isConstructable(value)) {
        if (value[boundValueSymbol]) {
          return value[boundValueSymbol];
        }

        var boundValue = value.bind(target); // some callable function has custom fields, we need to copy the enumerable props to boundValue. such as moment function.

        Object.keys(value).forEach(function (key) {
          return boundValue[key] = value[key];
        });
        Object.defineProperty(value, boundValueSymbol, {
          enumerable: false,
          value: boundValue
        });
        return boundValue;
      }

      return value;
    }
  });
  return {
    sandbox: sandbox,

    /**
     * 沙箱被 mount
     * 可能是从 bootstrap 状态进入的 mount
     * 也可能是从 unmount 之后再次唤醒进入 mount
     */
    mount: function () {
      var _mount = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var _freers;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                /* ------------------------------------------ 因为有上下文依赖（window），以下代码执行顺序不能变 ------------------------------------------ */

                /* ------------------------------------------ 1. 启动/恢复 快照 ------------------------------------------ */
                // 如果沙箱已启动，表明当前方法执行上下文是在沙箱生成之后，此时对应用的状态做 snapshot，以便下次唤醒应用时直接从 snapshot 中恢复沙箱上下文
                if (inAppSandbox) {
                  renderSandboxSnapshot = snapshot(currentUpdatedPropsValueMapForSnapshot);
                } else if (renderSandboxSnapshot) {
                  // 从 snapshot 中恢复沙箱上下文
                  renderSandboxSnapshot.forEach(function (v, p) {
                    return setWindowProp(p, v);
                  });
                }
                /* ------------------------------------------ 2. 开启全局变量补丁 ------------------------------------------*/
                // render 沙箱启动时开始劫持各类全局监听，这就要求应用初始化阶段不应该有 事件监听/定时器 等副作用


                (_freers = freers).push.apply(_freers, _toConsumableArray(hijack$4()));
                /* ------------------------------------------ 3. 重置一些初始化时的副作用 ------------------------------------------*/
                // 存在 rebuilder 则表明有些副作用需要重建


                if (sideEffectsRebuilders.length) {
                  sideEffectsRebuilders.forEach(function (rebuild) {
                    return rebuild();
                  });
                  sideEffectsRebuilders = [];
                }

                inAppSandbox = true;

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function mount() {
        return _mount.apply(this, arguments);
      }

      return mount;
    }(),

    /**
     * 恢复 global 状态，使其能回到应用加载之前的状态
     */
    unmount: function () {
      var _unmount = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (process.env.NODE_ENV === 'development') {
                  console.info("".concat(appName, " modified global properties will be restore"), [].concat(_toConsumableArray(addedPropsMapInSandbox.keys()), _toConsumableArray(modifiedPropsOriginalValueMapInSandbox.keys())));
                } // record the rebuilders of window side effects (event listeners or timers)


                freers.forEach(function (free) {
                  return sideEffectsRebuilders.push(free());
                });
                freers = []; // renderSandboxSnapshot = snapshot(currentUpdatedPropsValueMapForSnapshot);
                // restore global props to initial snapshot

                addedPropsMapInSandbox.forEach(function (_, p) {
                  return setWindowProp(p, undefined, true);
                });
                modifiedPropsOriginalValueMapInSandbox.forEach(function (v, p) {
                  return setWindowProp(p, v);
                });
                inAppSandbox = false;

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function unmount() {
        return _unmount.apply(this, arguments);
      }

      return unmount;
    }()
  };
}

/**
 * @author Kuitos
 * @since 2019-02-19
 */
var firstMountLogLabel = '[qiankun]: first app mounted';

if (process.env.NODE_ENV === 'development') {
  console.time(firstMountLogLabel);
}

function setDefaultMountApp(defaultAppLink) {
  window.addEventListener('single-spa:no-app-change', function () {
    var mountedApps = singleSpa.getMountedApps();

    if (!mountedApps.length) {
      singleSpa.navigateToUrl(defaultAppLink);
    }
  }, {
    once: true
  });
}
function runDefaultMountEffects(defaultAppLink) {
  console.warn('runDefaultMountEffects will be removed in next version, please use setDefaultMountApp instead!');
  setDefaultMountApp(defaultAppLink);
}
function runAfterFirstMounted(effect) {
  window.addEventListener('single-spa:first-mount', function () {
    if (process.env.NODE_ENV === 'development') {
      console.timeEnd(firstMountLogLabel);
    }

    effect();
  }, {
    once: true
  });
}

var microApps = [];

function toArray(array) {
  return Array.isArray(array) ? array : [array];
}

function execHooksChain(hooks, app) {
  if (hooks.length) {
    return hooks.reduce(function (chain, hook) {
      return chain.then(function () {
        return hook(app);
      });
    }, Promise.resolve());
  }

  return Promise.resolve();
}

function validateSingularMode(_x, _x2) {
  return _validateSingularMode.apply(this, arguments);
}

function _validateSingularMode() {
  _validateSingularMode = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee11(validate, app) {
    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            return _context11.abrupt("return", typeof validate === 'function' ? validate(app) : !!validate);

          case 1:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  }));
  return _validateSingularMode.apply(this, arguments);
}

var Deferred = function Deferred() {
  var _this = this;

  _classCallCheck(this, Deferred);

  this.promise = new Promise(function (resolve, reject) {
    _this.resolve = resolve;
    _this.reject = reject;
  });
};
/*
 * with singular mode, any app will wait to load until other apps are unmouting
 * it is useful for the scenario that only one sub app shown at one time
 */


var singularMode = false;
var useJsSandbox = false;
var frameworkStartedDefer = new Deferred();
function registerMicroApps(apps) {
  var lifeCycles = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var opts = arguments.length > 2 ? arguments[2] : undefined;
  // eslint-disable-next-line no-underscore-dangle
  window.__POWERED_BY_QIANKUN__ = true;
  var _lifeCycles$beforeUnm = lifeCycles.beforeUnmount,
      beforeUnmount = _lifeCycles$beforeUnm === void 0 ? [] : _lifeCycles$beforeUnm,
      _lifeCycles$afterUnmo = lifeCycles.afterUnmount,
      afterUnmount = _lifeCycles$afterUnmo === void 0 ? [] : _lifeCycles$afterUnmo,
      _lifeCycles$afterMoun = lifeCycles.afterMount,
      afterMount = _lifeCycles$afterMoun === void 0 ? [] : _lifeCycles$afterMoun,
      _lifeCycles$beforeMou = lifeCycles.beforeMount,
      beforeMount = _lifeCycles$beforeMou === void 0 ? [] : _lifeCycles$beforeMou,
      _lifeCycles$beforeLoa = lifeCycles.beforeLoad,
      beforeLoad = _lifeCycles$beforeLoa === void 0 ? [] : _lifeCycles$beforeLoa;

  var _ref = opts || {},
      fetch = _ref.fetch;

  microApps = [].concat(_toConsumableArray(microApps), _toConsumableArray(apps));
  var prevAppUnmountedDeferred;
  apps.forEach(function (app) {
    var name = app.name,
        entry = app.entry,
        render = app.render,
        activeRule = app.activeRule,
        _app$props = app.props,
        props = _app$props === void 0 ? {} : _app$props;
    singleSpa.registerApplication(name,
    /*#__PURE__*/
    function () {
      var _ref3 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee10(_ref2) {
        var appName, _ref4, appContent, execScripts, jsSandbox, mountSandbox, unmountSandbox, sandbox, _ref5, bootstrapApp, mount, unmount;

        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                appName = _ref2.name;
                _context10.next = 3;
                return frameworkStartedDefer.promise;

              case 3:
                _context10.next = 5;
                return importHtmlEntry.importEntry(entry, {
                  fetch: fetch
                });

              case 5:
                _ref4 = _context10.sent;
                appContent = _ref4.template;
                execScripts = _ref4.execScripts;
                _context10.next = 10;
                return validateSingularMode(singularMode, app);

              case 10:
                if (!_context10.sent) {
                  _context10.next = 13;
                  break;
                }

                _context10.next = 13;
                return prevAppUnmountedDeferred && prevAppUnmountedDeferred.promise;

              case 13:
                // 第一次加载设置应用可见区域 dom 结构
                // 确保每次应用加载前容器 dom 结构已经设置完毕
                render({
                  appContent: appContent,
                  loading: true
                });
                jsSandbox = window;

                mountSandbox = function mountSandbox() {
                  return Promise.resolve();
                };

                unmountSandbox = function unmountSandbox() {
                  return Promise.resolve();
                };

                if (useJsSandbox) {
                  sandbox = genSandbox(appName);
                  jsSandbox = sandbox.sandbox;
                  mountSandbox = sandbox.mount;
                  unmountSandbox = sandbox.unmount;
                }

                _context10.next = 20;
                return execHooksChain(toArray(beforeLoad), app);

              case 20:
                _context10.next = 22;
                return execScripts(jsSandbox);

              case 22:
                _ref5 = _context10.sent;
                bootstrapApp = _ref5.bootstrap;
                mount = _ref5.mount;
                unmount = _ref5.unmount;

                if (!(!_isFunction(bootstrapApp) || !_isFunction(mount) || !_isFunction(unmount))) {
                  _context10.next = 28;
                  break;
                }

                throw new Error("You need to export the functional lifecycles in ".concat(appName, " entry"));

              case 28:
                return _context10.abrupt("return", {
                  bootstrap: [bootstrapApp],
                  mount: [
                  /*#__PURE__*/
                  _asyncToGenerator(
                  /*#__PURE__*/
                  regeneratorRuntime.mark(function _callee() {
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            _context.next = 2;
                            return validateSingularMode(singularMode, app);

                          case 2:
                            _context.t0 = _context.sent;

                            if (!_context.t0) {
                              _context.next = 5;
                              break;
                            }

                            _context.t0 = prevAppUnmountedDeferred;

                          case 5:
                            if (!_context.t0) {
                              _context.next = 7;
                              break;
                            }

                            return _context.abrupt("return", prevAppUnmountedDeferred.promise);

                          case 7:
                            return _context.abrupt("return", undefined);

                          case 8:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee);
                  })),
                  /*#__PURE__*/
                  _asyncToGenerator(
                  /*#__PURE__*/
                  regeneratorRuntime.mark(function _callee2() {
                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                      while (1) {
                        switch (_context2.prev = _context2.next) {
                          case 0:
                            return _context2.abrupt("return", execHooksChain(toArray(beforeMount), app));

                          case 1:
                          case "end":
                            return _context2.stop();
                        }
                      }
                    }, _callee2);
                  })),
                  /*#__PURE__*/
                  // 添加 mount hook, 确保每次应用加载前容器 dom 结构已经设置完毕
                  _asyncToGenerator(
                  /*#__PURE__*/
                  regeneratorRuntime.mark(function _callee3() {
                    return regeneratorRuntime.wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            return _context3.abrupt("return", render({
                              appContent: appContent,
                              loading: true
                            }));

                          case 1:
                          case "end":
                            return _context3.stop();
                        }
                      }
                    }, _callee3);
                  })), mountSandbox, mount,
                  /*#__PURE__*/
                  // 应用 mount 完成后结束 loading
                  _asyncToGenerator(
                  /*#__PURE__*/
                  regeneratorRuntime.mark(function _callee4() {
                    return regeneratorRuntime.wrap(function _callee4$(_context4) {
                      while (1) {
                        switch (_context4.prev = _context4.next) {
                          case 0:
                            return _context4.abrupt("return", render({
                              appContent: appContent,
                              loading: false
                            }));

                          case 1:
                          case "end":
                            return _context4.stop();
                        }
                      }
                    }, _callee4);
                  })),
                  /*#__PURE__*/
                  _asyncToGenerator(
                  /*#__PURE__*/
                  regeneratorRuntime.mark(function _callee5() {
                    return regeneratorRuntime.wrap(function _callee5$(_context5) {
                      while (1) {
                        switch (_context5.prev = _context5.next) {
                          case 0:
                            return _context5.abrupt("return", execHooksChain(toArray(afterMount), app));

                          case 1:
                          case "end":
                            return _context5.stop();
                        }
                      }
                    }, _callee5);
                  })),
                  /*#__PURE__*/
                  // initialize the unmount defer after app mounted and resolve the defer after it unmounted
                  _asyncToGenerator(
                  /*#__PURE__*/
                  regeneratorRuntime.mark(function _callee6() {
                    return regeneratorRuntime.wrap(function _callee6$(_context6) {
                      while (1) {
                        switch (_context6.prev = _context6.next) {
                          case 0:
                            _context6.next = 2;
                            return validateSingularMode(singularMode, app);

                          case 2:
                            if (!_context6.sent) {
                              _context6.next = 4;
                              break;
                            }

                            prevAppUnmountedDeferred = new Deferred();

                          case 4:
                          case "end":
                            return _context6.stop();
                        }
                      }
                    }, _callee6);
                  }))],
                  unmount: [
                  /*#__PURE__*/
                  _asyncToGenerator(
                  /*#__PURE__*/
                  regeneratorRuntime.mark(function _callee7() {
                    return regeneratorRuntime.wrap(function _callee7$(_context7) {
                      while (1) {
                        switch (_context7.prev = _context7.next) {
                          case 0:
                            return _context7.abrupt("return", execHooksChain(toArray(beforeUnmount), app));

                          case 1:
                          case "end":
                            return _context7.stop();
                        }
                      }
                    }, _callee7);
                  })), unmount, unmountSandbox,
                  /*#__PURE__*/
                  _asyncToGenerator(
                  /*#__PURE__*/
                  regeneratorRuntime.mark(function _callee8() {
                    return regeneratorRuntime.wrap(function _callee8$(_context8) {
                      while (1) {
                        switch (_context8.prev = _context8.next) {
                          case 0:
                            return _context8.abrupt("return", execHooksChain(toArray(afterUnmount), app));

                          case 1:
                          case "end":
                            return _context8.stop();
                        }
                      }
                    }, _callee8);
                  })),
                  /*#__PURE__*/
                  _asyncToGenerator(
                  /*#__PURE__*/
                  regeneratorRuntime.mark(function _callee9() {
                    return regeneratorRuntime.wrap(function _callee9$(_context9) {
                      while (1) {
                        switch (_context9.prev = _context9.next) {
                          case 0:
                            _context9.next = 2;
                            return validateSingularMode(singularMode, app);

                          case 2:
                            _context9.t0 = _context9.sent;

                            if (!_context9.t0) {
                              _context9.next = 5;
                              break;
                            }

                            _context9.t0 = prevAppUnmountedDeferred;

                          case 5:
                            if (!_context9.t0) {
                              _context9.next = 7;
                              break;
                            }

                            prevAppUnmountedDeferred.resolve();

                          case 7:
                          case "end":
                            return _context9.stop();
                        }
                      }
                    }, _callee9);
                  }))]
                });

              case 29:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10);
      }));

      return function (_x3) {
        return _ref3.apply(this, arguments);
      };
    }(), activeRule, props);
  });
}
function start() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _opts$prefetch = opts.prefetch,
      prefetch = _opts$prefetch === void 0 ? true : _opts$prefetch,
      _opts$jsSandbox = opts.jsSandbox,
      jsSandbox = _opts$jsSandbox === void 0 ? true : _opts$jsSandbox,
      _opts$singular = opts.singular,
      singular = _opts$singular === void 0 ? true : _opts$singular,
      fetch = opts.fetch;

  if (prefetch) {
    prefetchAfterFirstMounted(microApps, fetch);
  }

  if (jsSandbox) {
    useJsSandbox = jsSandbox;
  }

  if (singular) {
    singularMode = singular;
  }

  singleSpa.start();
  frameworkStartedDefer.resolve();
}

exports.registerMicroApps = registerMicroApps;
exports.runAfterFirstMounted = runAfterFirstMounted;
exports.runDefaultMountEffects = runDefaultMountEffects;
exports.setDefaultMountApp = setDefaultMountApp;
exports.start = start;
