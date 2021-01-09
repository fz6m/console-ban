(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ConsoleBan = {}));
}(this, (function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

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
      return url[0] !== '/' ? "/" + url : url;
    }

    var ConsoleBan =
    /** @class */
    function () {
      function ConsoleBan(option) {
        var _a = __assign(__assign({}, defaultOptions), option),
            clear = _a.clear,
            debug = _a.debug,
            debugTime = _a.debugTime,
            callback = _a.callback,
            redirect = _a.redirect,
            write = _a.write;

        this._debug = debug;
        this._debugTime = debugTime;
        this._clear = clear;
        this._callback = callback;
        this._redirect = redirect;
        this._write = write;
      }

      ConsoleBan.prototype.clear = function () {
        if (this._clear) {
          console.clear = function () {};
        }
      };

      ConsoleBan.prototype.debug = function () {
        if (this._debug) {
          var db = new Function('debugger');
          setInterval(db, this._debugTime);
        }
      };

      ConsoleBan.prototype.redirect = function () {
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
      };

      ConsoleBan.prototype.callback = function () {
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
      };

      ConsoleBan.prototype.write = function () {
        if (this._write) {
          document.body.innerHTML = typeof this._write === 'string' ? this._write : this._write.innerHTML;
        }
      };

      ConsoleBan.prototype.ban = function () {
        // callback
        this.callback(); // clear console.clear

        this.clear(); // debug init

        this.debug();
      };

      return ConsoleBan;
    }();

    function init(option) {
      var instance = new ConsoleBan(option);
      instance.ban();
    }

    exports.default = init;
    exports.init = init;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
