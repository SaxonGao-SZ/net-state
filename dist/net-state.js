(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global['net-state'] = factory());
}(this, (function () { 'use strict';

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

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
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

  var IS_IN_WXMP = (typeof wx === "undefined" ? "undefined" : _typeof(wx)) === "object" && typeof wx.base64ToArrayBuffer === 'function' ? true : false;

  var StaticState =
  /*#__PURE__*/
  function () {
    function StaticState(readyHandle) {
      _classCallCheck(this, StaticState);

      this._readyHandle = readyHandle;

      this._checkOnline();
    }

    _createClass(StaticState, [{
      key: "isOnLine",
      value: function isOnLine() {
        if (IS_IN_WXMP) {
          return this._isOnLineWX();
        }

        return this._isOnLineWeb();
      }
    }, {
      key: "_isOnLineWeb",
      value: function _isOnLineWeb() {
        return new Promise(function (resolve, reject) {
          resolve(window.navigator.onLine);
        });
      }
    }, {
      key: "_isOnLineWX",
      value: function _isOnLineWX() {
        var _this = this;

        return new Promise(function (resolve, reject) {
          wx.getNetworkType({
            success: function success(res) {
              _this._isOnLine = res.networkType === 'none' ? false : true;
              resolve({
                isOnLine: _this._isOnLine
              });
            },
            fail: function fail(res) {
              _this._isOnLine = false;
              reject({
                isOnLine: _this._isOnLine
              });
            }
          });
        });
      }
    }, {
      key: "_checkOnline",
      value: function _checkOnline() {
        if (IS_IN_WXMP) {
          this._checkOnLineWX();

          return;
        }

        this._checkOnLineWeb();
      }
    }, {
      key: "_checkOnLineWX",
      value: function _checkOnLineWX() {
        var _this2 = this;

        wx.getNetworkType({
          success: function success(res) {
            _this2._isOnLine = res.networkType === 'none' ? false : true;

            _this2._readyHandle();
          }
        });
      }
    }, {
      key: "_checkOnLineWeb",
      value: function _checkOnLineWeb() {
        this._isOnLine = window.navigator.onLine;

        this._readyHandle();
      }
    }]);

    return StaticState;
  }();

  var StateChange =
  /*#__PURE__*/
  function () {
    function StateChange() {
      _classCallCheck(this, StateChange);

      if (IS_IN_WXMP) {
        this._initOnStateChangeWX();
      } else {
        this._initOnStateChangeWeb();
      }

      this.onOnLine = null;
      this.onOffLine = null;
    }

    _createClass(StateChange, [{
      key: "_initOnStateChangeWX",
      value: function _initOnStateChangeWX() {
        var _this = this;

        wx.onNetworkStatusChange(function (res) {
          if (res.isConnected) {
            _this.onOnLine({
              onLine: true
            });
          } else {
            _this.onOffLine({
              onLine: false
            });
          }
        });
      }
    }, {
      key: "_initOnStateChangeWeb",
      value: function _initOnStateChangeWeb() {
        var _this2 = this;

        window.ononline = function (res) {
          _this2.onOnLine({
            onLine: true
          });
        };

        window.onoffline = function (res) {
          _this2.onOffLine({
            onLine: false
          });
        };
      }
    }]);

    return StateChange;
  }();

  var NetState =
  /*#__PURE__*/
  function () {
    function NetState(def, handler) {
      _classCallCheck(this, NetState);

      // 如果使用了 handler 参数，那么它必需是 function 类型
      if (handler && typeof handler !== 'function') {
        throw new Error('param 1 , is not a function');
      }

      this._initMembers();

      this._online = false;

      if (typeof def === 'boolean') {
        this._online = def;
      }

      this._onReady = handler;
      this._static = new StaticState(this._ready.bind(this));
      this._stateChange = new StateChange();
      this._stateChange.onOnLine = this._onOnline.bind(this);
      this._stateChange.onOffLine = this._onOffline.bind(this);
    }

    _createClass(NetState, [{
      key: "_initMembers",
      value: function _initMembers() {
        this.EVENT = Object.create(null);
        this.EVENT.ONLINE = 1;
        this.EVENT.OFFLINE = 0;
        this._handlers = new Map();
      }
    }, {
      key: "_ready",
      value: function _ready() {
        this._triggerReady(Array.prototype.slice.call(arguments));
      }
    }, {
      key: "_triggerReady",
      value: function _triggerReady() {
        try {
          if (typeof this._onReady === 'function') {
            this._onReady();
          }
        } catch (err) {
          console.error(err);
        }
      } // 立即获取在线状态，注意：小程序下非同步

    }, {
      key: "isOnLine",
      value: function isOnLine() {
        return this._static.isOnLine();
      }
    }, {
      key: "on",
      value: function on(eventName, handler) {
        var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

        if (typeof eventName !== 'number') {
          throw new Error('param 1 : eventName, is not a number');
        }

        if (Object.values(this.EVENT).indexOf(eventName) < 0) {
          throw new Error("param 1 : eventName invalid value. refers: ".concat(JSON.stringify(this.EVENT)));
        }

        if (handler.name === '') {
          console.warn('warn : param 2 handler is a anonymouns function, it can not be off ');
        }

        if (!this._handlers.has(eventName)) {
          this._handlers.set(eventName, new Map());
        }

        var safeHandler = function safeHandler() {
          try {
            handler.apply(context, Array.prototype.slice.call(arguments));
          } catch (err) {
            console.log(err);
          }
        };

        this._handlers.get(eventName).set(handler, safeHandler);
      }
    }, {
      key: "off",
      value: function off(eventName, handler, context) {
        if (typeof eventName !== 'number') {
          throw new Error('param 1 : eventName, is not a number');
        }

        if (Object.values(this.EVENT).indexOf(eventName) < 0) {
          throw new Error("param 1 : eventName invalid value. refers: ".concat(JSON.stringify(this.EVENT)));
        }

        if (this._handlers.get(eventName).has(handler)) {
          this._handlers.get(eventName)["delete"](handler);
        }
      }
    }, {
      key: "_onOnline",
      value: function _onOnline() {
        var _arguments = arguments;

        var handlers = this._handlers.get(this.EVENT.ONLINE);

        handlers.forEach(function (value, key, map) {
          try {
            value(_toConsumableArray(_arguments));
          } catch (err) {
            console.error(err);
          }
        });
      }
    }, {
      key: "_onOffline",
      value: function _onOffline() {
        var _arguments2 = arguments;

        var handlers = this._handlers.get(this.EVENT.OFFLINE);

        handlers.forEach(function (value, key, map) {
          try {
            value(_arguments2);
          } catch (err) {
            console.error(err);
          }
        });
      }
    }]);

    return NetState;
  }();
  window.NetState = NetState;

  return NetState;

})));
