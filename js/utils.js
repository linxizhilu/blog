(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? module.exports = factory()
    : typeof define === 'function' && define.amd
      ? define(factory)
      : (global.utils = factory());
})(window, function() {
  var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function(fn) {
    return setTimeout(function() {
      fn()
    }, 1000 / 60);
  };
  window.requestAnimationFrame = requestAnimationFrame;
  var cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame || window.oCancelAnimationFrame || function(id) {
    window.clearTimeout(id);
  };
  window.cancelAnimationFrame = cancelAnimationFrame;

  // 内部使用变量
  var aryIntance = [],
    objIntance = {},
    count = 0;

  var luq_Utils = function() {
    if (this instanceof luq_Utils) {} else {
      return new luq_Utils();
    }
    count = 0;
  };
  luq_Utils.prototype.captureMouse = function(elem) {
    var mouse = {
      x: 0,
      y: 0
    };
    this.addEvent(elem, 'mousedown', function(event) {
      var x,
        y;
      if (event.pageX || event.pageY) {
        x = event.pageX;
        y = event.pageY;
      } else {
        x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
      }
      x -= elem.offsetLeft;
      y -= elem.offsetTop;
      mouse.x = x;
      mouse.y = y;
    }, false);
    return mouse;
  }
  luq_Utils.prototype.captureTouch = function(elem) {
    var touch = {
      x: null,
      y: null,
      isPressed: false
    };
    this.addEvent(elem, 'touchstart', function(e) {
      touch.isPressed = true;
    })
    this.addEvent(elem, 'touchmove', function(event) {
      var x,
        y,
        touch_event = event.touches[0];
      if (touch_event.pageX) {
        x = touch_event.pageX;
        y = touch_event.pageY;
      } else {
        x = touch_event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = touch_event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
      }
      x -= elem.offsetLeft;
      y -= elem.offsetTop;
      touch.x = x;
      touch.y = y;
      console.log(touch);
    });
    this.addEvent(elem, 'touchend', function(e) {
      touch.isPressed = false;
      touch.x = null;
      touch.y = null;
    })
    return touch;

  }
  luq_Utils.prototype.showMousePos = function(elem, fn) {
    var mouse = {
      x: 0,
      y: 0
    };
    var span = document.createElement('span');
    span.style.position = 'absolute';
    span.style.border = "1px solid #aaa";
    this.addEvent(elem, 'mousemove', function(event) {
      var x,
        y;
      if (event.pageX || event.pageY) {
        x = event.pageX;
        y = event.pageY;
      } else {
        x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
      }
      x -= elem.offsetLeft;
      y -= elem.offsetTop;
      span.style.left = x + 15 + 'px';
      span.style.top = y + 10 + 'px';
      // console.log(mouse);
      span.innerHTML = "x:<i style='color:red'>" + (x - window.innerWidth / 2).toFixed(0) + "</i>,y:<i style='color:red'>" + ((y - window.innerHeight / 2).toFixed(0)) + "</i>";
      mouse = {
        x: x - window.innerWidth / 2,
        y: y - window.innerHeight / 2
      };
      if (!!fn) {
        fn({
          x: (x - window.innerWidth / 2).toFixed(0),
          y: (y - window.innerHeight / 2).toFixed(0)
        });
      }
    }, false);
    document.body.appendChild(span);
    return mouse;
  }
var nav = navigator
    , ua = nav.userAgent
    , iPad = ua.match(/(iPad).*OS\s([\d_]+)/)
    , iPod = ua.match(/(iPod).*OS\s([\d_]+)/i)
    , namespace = ''
    , hasTouch = !!ua.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)//('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch
    , rEmail = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
    , rMobile = /^(1[3-9]{1}[0-9]{1})\d{8}$/

var extendObj = {
    namespace         : namespace,
    nav               : nav,
    ua                : ua,
    webKit            : ua.match(/WebKit\/([\d.]+)/),
    android           : ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1,//ua.indexOf('Android')!=-1 || ua.indexOf('Mozilla/5.0') > -1 && ua.indexOf('AppleWebKit') > -1 && ua.indexOf('Chrome') >= -1//ua.match(/(Android)\s+([\d.]+)/)
    iPad              : iPad,
    iPod              : iPod,
    iPhone            : !iPod && !iPad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
    hasTouch          : hasTouch,
    // 常用事件
    mouseenter        : hasTouch ? 'touchend' + namespace + ' touchcancel' + namespace    : 'mouseenter' + namespace,
    mouseleave        : hasTouch ? 'touchend' + namespace + ' touchcancel' + namespace    : 'mouseleave' + namespace,
    mousedown         : hasTouch ? 'touchstart' + namespace   : 'mousedown' + namespace,
    mouseup           : hasTouch ? 'touchend' + namespace  + ' touchcancel' + namespace   : 'mouseup' + namespace,
    mousemove         : hasTouch ? 'touchmove' + namespace    : 'mousemove' + namespace,
    click             : hasTouch ? 'touchend' + namespace  + ' touchcancel' + namespace   : 'click' + namespace,
    // 拷贝
    extend : function(boolean, target, obj) {
      var key,
        length,
        type = extendObj.type,
        typeObj = type(obj),
        typeTarget = type(target);
      if ((typeTarget !== 'object' && typeTarget !== 'array') || target === obj) {
        return target;
      }
      if (!!boolean) {
        if (typeObj === "object") {
          for (key in obj) {
            if (typeof obj[key] === "object") {
              target[key] = target[key] || type(obj[key]) === 'object'
                ? {}
                : [];
              target[key] = arguments.callee(boolean, target[key], obj[key]);
            } else {
              target[key] = obj[key];
            }
          }
        } else if (typeObj === "array") {
          for (key = 0, length = obj.length; key < length; key++) {
            target.push(obj[key]);
          }
        } else if (typeObj === 'function') {
          target[obj] = obj;
        } else {
          target = obj;
        }
      } else {
        if (typeObj === 'object') {
          for (key in obj) {
            target[key] = obj[key];
          }
        } else if (typeObj === 'array') {
          for (key = 0, length = obj.length; key < length; key++) {
            target.push(obj[key]);
          }
        } else if (typeObj === 'function') {
          target[obj] = obj;
        } else {
          target = obj;
        }
      }
      return target;
    },
    type : function(obj) {
      var type;
      if (obj !== obj && isNaN(obj)) {
        type = "NaN"
      } else if (typeof obj === 'undefined') {
        type = 'undefined';
      } else if (typeof obj == 'object' && !obj) {
        type = 'null'
      } else {
        type = ({}).toString.call(obj);
        type = type.slice(8, -1).toLowerCase();
      }
      return type;
    },
    addEvent: function(dom, type, fn, str, boolean) {
      var fnName,
        tempFn,
        tempBoolean = this.type(arguments[arguments.length]) === 'boolean'
          ? boolean
          : false;
      if (!(fnName = fn.name)) {
        fnName = str || type;
      }
      dom.eventsHandles = {};
      tempFn = dom.eventsHandles[fnName] = fn;
      if (window.addEventListener) {
        dom.addEventListener(type, tempFn, tempBoolean);
      } else if (window.attachEvent) {
        dom.attachEvent('on' + type, tempFn);
      } else {
        dom['on' + type] = tempFn;
      }
    },
    removeEvent: function(dom, type, fn) {
      var fnName,
        tempFn;
      if (this.type(fn) === 'function' && !!fn.name) {
        tempFn = fn;
      } else {
        if (this.type(fn) === 'string') {
          fnName = fn;
        } else {
          fnName = type;
        }
        tempFn = !!dom.eventsHandles && dom.eventsHandles[fnName];
      }
      if (this.type(tempFn) !== 'function') {
        this.error('事件处理函数不存在,或传入的为匿名函数');
        return;
      }
      if (window.removeEventListener) {
        dom.removeEventListener(type, tempFn);
      } else if (window.addEventListener) {
        dom.detachEvent('on' + type, tempFn);
      } else {
        dom['on' + type] = null;
      }
    },
    _nativeSlice: aryIntance.slice,
    _nativeSpice: aryIntance.splice,
    _nativeForEach: aryIntance.forEach,
    _nativeMap: aryIntance.map,
    _nativeReduce: aryIntance.reduce,
    _nativeReduceRight: aryIntance.reduceRight,
    _nativeEvery: aryIntance.every,
    _nativeSome: aryIntance.some,
    _nativeFilter: aryIntance.filter,
    _nativeTrim: ('').trim,
    // 无返回值
    forEach: function(ary, fn, obj) {
      var i = 0,
        len,
        tempObj = obj || null;
      if (this.type(fn) !== 'function' || this.type(ary) !== 'array') {
        this.error('请传入正确的参数[array,function]');
        return;
      }
      if (!!this._nativeForEach) {
        this._nativeForEach.apply(ary, this._nativeSlice.call(arguments, 1));
      } else {
        for (len = ary.length; i < len; ++i) {
          fn.call(tempObj, ary[i], i, ary);
        }
      }
    },
    delRepeat: function(ary) {
      var i,
        len;
      if (this.type(ary) !== 'array') {
        this.error('请传入数组');
      };
      for (i = 0, len = ary.length; i < len; i++) {
        if (ary.indexOf(ary[i]) !== i) {
          ary.splice(i, 1);
        }
      }
      return ary;
    },
    clone: function(any) {
      var type,
        tempAny = any;
      if ((type = typeof any) === 'object') {
        if (!window.JSON && JSON.parse) {
          return JSON.parse(JSON.stringify(any));
        } else {
          if (this.type(any) === 'array') {
            any = this.extend(true, [], any);
          } else {
            any = this.extend(true, {}, any);
          }
        };
      } else {
        any = tempAny;
      }
      return any;
    },
    map: function(ary, fn, obj) {
      var tempAry = [],
        i = 0,
        len = ary.length,
        tempObj = obj || null;
      if (this.type(fn) !== 'function' || this.type(ary) !== 'array') {
        this.error('请传入正确的参数[array,function]');
        return;
      }
      if (!!this._nativeMap) {
        tempAry = this._nativeMap.apply(ary, this._nativeSlice.call(arguments, 1));
      } else {
        for (; i < len; i++) {
          tempAry[i] = fn.call(tempObj, ary[i], i, ary);
        }
      }
      return tempAry;
    },
    filter: function() {
      var tempAry = [],
        i = 0,
        len = ary.length,
        tempObj = obj || null,
        result = false;
      if (this.type(fn) !== 'function' || this.type(ary) !== 'array') {
        this.error('请传入正确的参数[array,function]');
        return;
      }
      if (!!this._nativeFilter) {
        tempAry = this._nativeFilter.apply(ary, this._nativeSlice.call(arguments, 1));
      } else {
        for (; i < len; i++) {
          result = fn.call(tempObj, ary[i], i, ary);
          if (!!result) {
            tempAry.push(ary[i]);
          }
        }
      }
      return tempAry;
    },
    reduce: function(ary, fn, initinal, obj) {
      var result,
        i = 0,
        len = ary.length,
        current,
        prev,
        flag = typeof initinal === 'undefined'
          ? false
          : true,
        tempAry = this._nativeSlice.call(ary, 0),
        tempObj = obj || null;
      if (this.type(fn) !== 'function' || this.type(ary) !== 'array') {
        this.error('请传入正确的参数[array,function]');
        return;
      };
      if (!!this._nativeReduce) {
        result = this._nativeReduce.apply(ary, this._nativeSlice.call(arguments, 1));
      } else {
        if (len === 0 && !flag) {
          this.error('请传入正确的参数');
          return;
        }
        if (flag) {
          len = ary.unshift(initinal);
        }
        if (len === 1) {
          result = ary[0];
        } else {
          for (i = 1; i < len; i++) {
            current = ary[i];
            if (typeof current !== 'undefined') {
              prev = typeof result !== 'undefined'
                ? result
                : ary[i - 1];
              result = fn.call(tempObj, prev, current, i, tempAry);
            }
          }
        }
      }
      return result;
    },
    reduceRight: function(ary, fn, initinal) {
      if (this.type(fn) !== 'function' || this.type(ary) !== 'array') {
        this.error('请传入正确的参数[array,function]');
        return;
      };
      if (!!this._nativeReduceRight) {
        return this._nativeReduceRight.apply(ary, this._nativeSlice.call(arguments, 1));
      } else {
        ary = ary.reverse();
        return this.reduce(ary, fn, initinal);
      }
    },
    every: function(ary, fn, obj) {
      var i = 0,
        len = ary.length,
        tempObj = obj || null,
        result = true;
      if (this.type(fn) !== 'function' || this.type(ary) !== 'array') {
        this.error('请传入正确的参数[array,function]');
        return;
      };
      if (!!this._nativeEvery) {
        return this._nativeEvery.apply(ary, this._nativeSlice.call(arguments, 1));
      } else {
        for (; i < len; i++) {
          result = fn.call(obj, ary[i], i, ary);
          if (!result) {
            return result;
          }
        }
        return result;
      }
    },
    some: function(ary, fn, obj) {
      var i = 0,
        len = ary.length,
        tempObj = obj || null,
        result = false;
      if (this.type(fn) !== 'function' || this.type(ary) !== 'array') {
        this.error('请传入正确的参数[array,function]');
        return;
      };
      if (!!this._nativeEvery) {
        return this._nativeEvery.apply(ary, this._nativeSlice.call(arguments, 1));
      } else {
        for (; i < len; i++) {
          result = fn.call(obj, ary[i], i, ary);
          if (!!result) {
            return result;
          }
        }
        return result;
      }
    },
    format: function(date, str) {
      if (typeof date !== 'object') {
        date = new Date(stamp);
      }
      date['Y'] = date.getFullYear();
      date['M'] = addZero(parseInt(date.getMonth()) + 1);
      date['D'] = addZero(date.getDate());
      date['hh'] = addZero(date.getHours());
      date['mm'] = addZero(date.getMinutes());
      date['ss'] = addZero(date.getSeconds());
      str = str.replace(/([\w])+/ig, function(item) {
        if (!!date[item]) {
          return date[item];
        } else {
          return item;
        }
      })
      function addZero(date) {
        return date < 10
          ? '0' + date
          : date;
      }
      return str;
    },
    aryTrim: function(ary) {
      var i = 0,
        len = ary.length;
      for (; i < len; i++) {
        if (typeof ary[i] === 'undefined') {
          ary.splice(i, 1);
        }
      }
      return ary;
    },
    hasTouch: function() {
      return 'ontouchend' in document;
    },
    angle: function(radian) {
      return 180 / radian * Math.PI;
    },
    getRadian: function(angle) {
      return Math.PI / 180 * angle;
    },
    log: function(msg) {
      console.log(msg);
    },
    error: function(title, e) {
      title = title || '';
      if (!!e) {
        console.error(title + ":" + e);
      } else {
        console.error(title);
      }
    },
    ready: (function() {
      var funcs = [],
        ready = false;
      function handlers(e) {
        if (ready) {
          return;
        }
        if (e.type === 'readystatechange' && document.readyState !== 'complete') {
          return;
        }
        for (var i, len = funcs.length; i < len; i++) {
          funcs[i].call(document);
        }
        ready = true;
        funcs = null;
      }
      addEvent(document, 'DOMContentLoaded', handlers);
      addEvent(document, 'readystatechange', handlers);
      addEvent(window, 'load', handlers);
      function addEvent(dom, type, tempFn) {
        if (window.addEventListener) {
          dom.addEventListener(type, tempFn);
        } else if (window.attachEvent) {
          dom.attachEvent('on' + type, tempFn);
        } else {
          dom['on' + type] = tempFn;
        }
      }
      return function(fn) {
        if (ready) {
          fn.call(document);
        } else {
          funcs.push(fn);
        }
      }
    }).call(luq_Utils.prototype),
    trim: function(str) {
      if (!str)
        return str;
      if (!!_nativeTrim) {
        return _nativeTrim.call(str);
      }
      return str.replace(/^\s+|\s+$/, '');
    },
    scroll:function(val){
      var doc = document,
          length = arguments.length,
          resultAry=['top','left','Height','Width'],
          resultObj = Object.create(null),
          val = val || '';
        if(count++ >50)return;
      if(length>0){
        if(resultAry.includes(val)){
          val = val.charAt(0).toUpperCase().concat(val.substring(1));
          return Math.max(doc.documentElement['scroll'+val], doc.body['scroll'+val]);
        }
        return ;
      }
      for(let i = 0,len = resultAry.length;i<len;i++){
        val = resultAry[i];
        console.log(val)
        resultObj[val] =arguments.callee(val);
      }
      return resultObj;
    },
    scrollTop: function() {
      return this.scroll('top');
    },
    scrollLeft:function(){
      return this.scroll('left');
    },
    scrollHeight: function() {
      return this.scroll('height');
    },
    scrollWidth:function(){
      return this.scroll('width');
    },
    ie:!!window.VBArray,
    ie678:!+"\v1",
    ie678:!-[1,],
    ie678:'\v'=='v',
    ie678:('a-b'.split(/(~)/))[1]=="b",
    ie678:0.9.toFixed(0)=="0",
    ie678:/\w/.test('\u0130'),

    ie8:window.toStaticHTML,
    ie9:window.msPerformance,
    ie678:0,//@cc_on+1;
    ie67:!"1"[0],
    ie8:!!window.XDomainRequest,
    ie9:document.documentMode&&document.documentMode===9,
    ie10 : window.navigator.msPointerEnabled,
    ie11 : !!window.MSInputMethodContext,
    firefox:!!window.netscape || !!window.updateCommands,
    safari:window.openDatabase&&!window.chrome,
    chrome:!!(window.chrome),
    iphone:/iphone/i.test(navigator.userAgent),
    iphone4:window.devicePixelRatio>=2,
    ipad:/iPad/i.test(navigator.userAgent),
    Android:/android/i.test(navigator.userAgent),
    iOS:window.devicePixelRatio>=2 || /iPad/i.test(navigator.userAgent),
    //延迟执行
    debounce : function(func, wait, immediate) {
      var timeout, args, context, timestamp, result;

      var later = function() {
      var last = Date.now() - timestamp;

      if (last < wait && last >= 0) {
          timeout = setTimeout(later, wait - last);
      } else {
          timeout = null;
          if (!immediate) {
              result = func.apply(context, args);
              if (!timeout) context = args = null;
          }
      }
      };
      return function() {
          context = this;
          args = arguments;
          timestamp = Date.now();
          var callNow = immediate && !timeout;
          if (!timeout) timeout = setTimeout(later, wait);
          if (callNow) {
              result = func.apply(context, args);
              context = args = null;
          }

          return result;
      };
    },
    throttle : function(func, wait, options) {
      var context, args, result;
      var timeout = null;
      var previous = 0;
      if (!options) options = {};
      var later = function() {
          previous = options.leading === false ? 0 : Date.now();
          timeout = null;
          result = func.apply(context, args);
          if (!timeout) context = args = null;
      };
      return function() {
          var now = Date.now();
          if (!previous && options.leading === false) previous = now;
          var remaining = wait - (now - previous);
          context = this;
          args = arguments;
          if (remaining <= 0 || remaining > wait) {
              if (timeout) {
              clearTimeout(timeout);
              timeout = null;
              }
              previous = now;
              result = func.apply(context, args);
              if (!timeout) context = args = null;
          } else if (!timeout && options.trailing !== false) {
              timeout = setTimeout(later, remaining);
          }
          return result;
      }
    },
    queryDom:function(selector, elem,boolean) {
        if (arguments.length === 0) {
            return document;
        }
        var type,
            _elem = ((type = typeof elem) === 'undefined' || (elem.nodeType && elem.nodeType) === 9) ? document : type === 'string' ? document.querySelector(elem) : type === 'object' && elem.nodeType && elem.nodeType === 1 ? elem : document,
            _dom = (type = typeof selector) === 'string' ? boolean ?_elem.querySelectorAll(selector) :_elem.querySelector(selector) : type === 'object' && selector.nodeType && selector.nodeType === 1 ? selector : _elem;
        return _dom;
    }
  }
  luq_Utils.prototype = extendObj.extend(true, luq_Utils.prototype,extendObj);
 return new luq_Utils();
})
