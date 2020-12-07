'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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

var defaultOptions = {
  clear: true,
  debug: true,
  debugTime: 3000
};

/**
 * 处理 URL 补全
 * @example '' -> /
 * @example path -> /path
 * @example /path -> /path
 * @param url
 */
function completion(url) {
  if (!url) return '/';
  return url[0] !== '/' ? "/".concat(url) : url;
}

var ConsoleBan = /*#__PURE__*/function () {
  function ConsoleBan(option) {
    _classCallCheck(this, ConsoleBan);

    var _defaultOptions$optio = _objectSpread2(_objectSpread2({}, defaultOptions), option),
        clear = _defaultOptions$optio.clear,
        debug = _defaultOptions$optio.debug,
        debugTime = _defaultOptions$optio.debugTime,
        callback = _defaultOptions$optio.callback,
        redirect = _defaultOptions$optio.redirect,
        write = _defaultOptions$optio.write;

    this._debug = debug;
    this._debugTime = debugTime;
    this._clear = clear;
    this._callback = callback;
    this._redirect = redirect;
    this._write = write;
  }

  _createClass(ConsoleBan, [{
    key: "clear",
    value: function clear() {
      if (this._clear) {
        console.clear = function () {};
      }
    }
  }, {
    key: "debug",
    value: function debug() {
      if (this._debug) {
        var db = new Function('debugger');
        setInterval(db, this._debugTime);
      }
    }
  }, {
    key: "redirect",
    value: function redirect() {
      if (!this._redirect) {
        return;
      } // 绝对地址


      if (!!~this._redirect.indexOf('http')) {
        location.href !== this._redirect ? location.href = this._redirect : null;
        return;
      } // 相对地址


      var path = location.pathname + location.search;

      if (completion(this._redirect) === path) {
        return;
      }

      location.href = this._redirect;
    }
  }, {
    key: "callback",
    value: function callback() {
      var _this = this;

      if (!this._callback && !this._redirect && !this._write) {
        return;
      }

      var img = new Image();
      Object.defineProperty(img, 'id', {
        get: function get() {
          // callback
          if (_this._callback) {
            _this._callback.call(null);

            return;
          } // redirect


          _this.redirect();

          if (_this._redirect) {
            return;
          } // write


          _this.write();
        }
      });
      console.log(img);
    }
  }, {
    key: "write",
    value: function write() {
      if (this._write) {
        document.body.innerHTML = typeof this._write === 'string' ? this._write : this._write.innerHTML;
      }
    }
  }, {
    key: "ban",
    value: function ban() {
      // callback
      this.callback(); // clear console.clear

      this.clear(); // debug init

      this.debug();
    }
  }]);

  return ConsoleBan;
}();

function init(option) {
  var instance = new ConsoleBan(option);
  instance.ban();
}

exports.init = init;
