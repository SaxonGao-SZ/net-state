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

  var IS_IN_WXMP = (typeof wx === "undefined" ? "undefined" : _typeof(wx)) === "object" && typeof wx.base64ToArrayBuffer === 'function' ? true : false;

  var StaticState =
  /*#__PURE__*/
  function () {
    function StaticState(readyHandle) {
      _classCallCheck(this, StaticState);

      this._isOnLine = false;
      this._readyHandle = readyHandle;

      this._checkOnline();
    }

    _createClass(StaticState, [{
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
        var _this = this;

        wx.getNetworkType({
          success: function success(res) {
            _this._isOnLine = res.networkType === 'none' ? false : true;

            _this._readyHandle();
          }
        });
      }
    }, {
      key: "_checkOnLineWeb",
      value: function _checkOnLineWeb() {
        this._isOnLine = window.navigator.onLine;

        this._readyHandle();
      }
    }, {
      key: "isOnLine",
      get: function get() {
        return this._isOnLine;
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
        this._triggerReady(arguments);
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
            handler.apply(context, arguments);
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
            value(_arguments);
          } catch (err) {
            console.error(err);
          }
        });
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = handlers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var handler = _step.value;

            try {
              handler[1](arguments);
            } catch (err) {
              console.error(err);
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
    }, {
      key: "_onOffline",
      value: function _onOffline() {
        var handlers = this._handlers.get(this.EVENT.OFFLINE);

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = handlers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var handler = _step2.value;

            try {
              handler(arguments);
            } catch (err) {
              console.error(err);
            }
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
              _iterator2["return"]();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }
    }, {
      key: "onLine",
      get: function get() {
        return this._static.isOnLine;
      }
    }]);

    return NetState;
  }();
  window.NetState = NetState;

  return NetState;

})));
