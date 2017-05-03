(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ?
    module.exports = factory() :
    typeof define === 'function' && define.amd ?
    define(factory) :
    (global.bice = factory());
})($, function() {

  // 常用变量
  var ArrayProto = Array.prototype,
    ObjProto = Object.prototype,
    FuncProto = Function.prototype,
    push = ArrayProto.push,
    slice = ArrayProto.slice,
    toString = ObjProto.toString,
    hasOwnProperty = ObjProto.hasOwnProperty,
    nativeIsArray = Array.isArray,
    nativeKeys = Object.keys,
    nativeBind = FuncProto.bind,
    nativeCreate = Object.create,
    nav = navigator,
    ua = nav.userAgent,
    iPad = ua.match(/(iPad).*OS\s([\d_]+)/),
    iPod = ua.match(/(iPod).*OS\s([\d_]+)/i),
    namespace = '.bice',
    hasTouch = !!ua.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i) //('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch
    ,
    rEmail = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/,
    rMobile = /^(1[3-9]{1}[0-9]{1})\d{8}$/,
    slice = Array.prototype.slice,
    $window = $(window);


  // 一些常用事件，判断浏览器设备等
  var bice = {
    // 命名空间
    namespace: namespace,
    nav: nav,
    ua: ua,
    webKit: ua.match(/WebKit\/([\d.]+)/),
    android: ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1 //ua.indexOf('Android')!=-1 || ua.indexOf('Mozilla/5.0') > -1 && ua.indexOf('AppleWebKit') > -1 && ua.indexOf('Chrome') >= -1//ua.match(/(Android)\s+([\d.]+)/)
      ,
    iPad: iPad,
    iPod: iPod,
    iPhone: !iPod && !iPad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
    hasTouch: hasTouch
      // 常用事件
      ,
    mouseenter: hasTouch ? 'touchend' + namespace + ' touchcancel' + namespace : 'mouseenter' + namespace,
    mouseleave: hasTouch ? 'touchend' + namespace + ' touchcancel' + namespace : 'mouseleave' + namespace,
    mousedown: hasTouch ? 'touchstart' + namespace : 'mousedown' + namespace,
    mouseup: hasTouch ? 'touchend' + namespace + ' touchcancel' + namespace : 'mouseup' + namespace,
    mousemove: hasTouch ? 'touchmove' + namespace : 'mousemove' + namespace,
    click: hasTouch ? 'touchend' + namespace + ' touchcancel' + namespace : 'click' + namespace
  }

  // 初始化一些方法和参数
  bice.config = {
    throttleTime: 100,
    debounceTime: 300,
    resize: {
      standard: 1024,
      medium: 768,
      small: 767
    }
  }

  bice.resizeScreenDebounce = function(opt) {
    var config = $.extend({}, bice.config, {
      checkRetina: true,
      callBack: null
    }, opt);

    var obj = config.resize,
      sortByObj = bice.sortBy(obj),
      invertObj = bice.invert(obj),
      fn = function() {
        var wW = bice.getWindowWidth(),
          media;
        $.each(sortByObj, function(i, v) {
          if (i === 0) {
            if (wW <= v) {
              media = invertObj[v];
            }
          }
          if (sortByObj[i + 1]) {
            if (wW <= sortByObj[i + 1] && wW >= v) {
              media = invertObj[v];
            }
          } else {
            if (wW > v) {
              media = invertObj[v];
            }
          }
        });

        // 判断是否是高清屏
        if (config.checkRetina && window.devicePixelRatio > 1) {
          media += 'Retina';
        }

        config.callBack && $.isFunction(config.callBack) && config.callBack(media);
      };

    if (config.debounceTime === 0) {
      return fn;
    } else {
      // 使用 debounce ，优化resize调用次数
      return bice.debounce(fn, config.debounceTime);
    }

  }

  var resizeScreenDebounce;
  bice.init = function(opt) {
    bice.config = $.extend({}, bice.config, opt);
    if (!resizeScreenDebounce) {
      var classList = [];
      $.each(bice.config.resize, function(i, v) {
        classList.push('e-bice-' + i + ' style-bice-' + i);
      });
      classList = classList.join(' ');
      resizeScreenDebounce = bice.resizeScreenDebounce({
        checkRetina: false,
        callBack: function(media) {
          $('body')
            .removeClass(classList)
            .addClass('e-bice-' + media + ' style-bice-' + media);
        }
      });
      resizeScreenDebounce();

      $(window)
        .off('resize.bice-screen')
        .on('resize.bice-screen', function() {
          resizeScreenDebounce();
        })
        .trigger('resize.bice-screen');

    }
  }


  // 返回body下最大的zIndex值
  bice.getMaxZIndex = function() {
    return Math.max.apply(null, $('*', document.body).map(function() {
      return $(this).css('zIndex') >>> 0;
    }).get());
  }

  // 获取不同设备下的 event
  // 传入 event 对象，兼容 pc 和 mobile
  bice.getEvent = function(e) {
    return bice.hasTouch ? e.originalEvent.changedTouches : e;
  }

  // 获取当前 event 第一个位置的 x, y
  bice.getEventXY = function(e) {
    var ev = bice.getEvent(e);
    return {
      x: ev.clientX ? ev.clientX : (ev[0] ? ev[0].pageX : 0),
      y: ev.clientY ? ev.clientY : (ev[0] ? ev[0].pageY : 0)
    };
  }

  // 返回字符串的字符长度，一个中文占两个字符长度
  bice.getStringLength = function(str) {
    var num = 0,
      i = 0,
      len = str.length,
      unicode;
    for (; i < len; i++) {
      unicode = str.charCodeAt(i);
      num += unicode > 127 ? 2 : 1;
    }
    return num;
  }

  // 本函数将字符串 str 的第 start 位起的字符串取出 strlen 个字符。
  // 若 start 为负数，则从字符串尾端算起。
  // 若可省略的参数 strlen 存在，但为负数，则表示取到倒数第 strlen 个字符。
  // str 要截取的字符串
  // start 开始点
  // strlen 截取长度
  bice.subString = function(str, start, strlen) {
    var i = 0,
      num = 0,
      unicode, rstr = '',
      len = str.length,
      sblen = bice.getStringLength(str);

    if (start < 0) {
      start = sblen + start;
    }

    if (strlen < 0 || $.type(strlen) != 'number') {
      strlen = ~~strlen + sblen;
    } else {
      strlen += start;
    }

    // 起点
    for (; i < len; i++) {
      if (num >= start) {
        break;
      }
      var unicode = str.charCodeAt(i);
      num += unicode > 127 ? 2 : 1;
    }

    // 开始取
    for (; i < len; i++) {
      var unicode = str.charCodeAt(i);
      num += unicode > 127 ? 2 : 1;

      if (num > strlen) {
        break;
      }

      rstr += str.charAt(i);
    }

    return rstr;
  }

  // 得到url所传参数的值
  bice.getURLParameter = function(key, frame) {
    var param = (frame || window).location.search,
      reg = new RegExp('[&\?]+' + key + '=([^&]*)'),
      str = '';
    if (reg.test(param)) str = RegExp.$1;
    return str;
  }

  // 元素的可视区域
  // elem 元素选择器
  // callBack 元素在可视区域的回调函数
  bice.visualArea = function(elem, options) {
    if (!elem || $(elem).length == 0) return false;
    var opt = {
      callBack: null,
      num: 0
    }
    opt = $.extend({}, opt, options);
    $window.off('scroll.bice.visualArea').on('scroll.bice.visualArea', function() {
      var $W = $(this);
      if ($W.scrollTop() + $W.height() > $(elem).offset().top - opt.num) {
        opt.callBack && $.isFunction(opt.callBack) && opt.callBack($(elem));
      }
    }).trigger('scroll.bice.visualArea');
  }

  // 获取浏览器滚动条宽度
  bice.getScrollbarWidth = function() {
    if (bice.android || $('body').height() <= $window.height()) {
      return 0;
    } else {
      var p = document.createElement('p'),
        styles = {
          width: '100px',
          height: '100px',
          overflowY: 'scroll'
        },
        i, scrollbarWidth;
      for (i in styles) p.style[i] = styles[i];
      document.body.appendChild(p);
      scrollbarWidth = p.offsetWidth - p.clientWidth;
      $(p).remove();
      return scrollbarWidth;
    }
  }

  // 获取 window 的宽度
  bice.getWindowWidth = function() {
    return $window.width() + bice.getScrollbarWidth();
  }

  // 获取时间戳
  bice.getTimestamp = function() {
    return (new Date()).getTime().toString();
  }

  // 获取Cookie的值
  bice.getCookie = function(cookieName) {
    var getC = document.cookie,
      reg = new RegExp(cookieName + '=([^;]*)');
    var val = '';
    if (reg.test(getC)) {
      val = RegExp.$1;
    }
    return val;
  }

  // 计算毫秒，返回毫秒数
  bice.getDates = function(temer) {
    var timeSize = ['s', 'm', 'h', 'D', 'W', 'M', 'Y'];
    var tl = temer.length;
    var str = {};
    var s = 24 * 60 * 60;
    var sum = 0;
    var arra = temer.match(/\d+\w/g);
    if (arra == null) return false;
    for (var i = 0, l = arra.length; i < l; i++) {
      new RegExp('^(\\d+)([a-z]+)$', 'i').test(arra[i]);
      str[RegExp.$2] = RegExp.$1;
    }
    if (str.s) sum = +str.s;
    if (str.m) sum += +str.m * 60;
    if (str.h) sum += +str.h * 60 * 60;
    if (str.D) sum += +str.D * s;
    if (str.W) sum += +str.W * s * 7;
    if (str.M) sum += +str.M * s * 30;
    if (str.Y) sum += +str.Y * s * 365;
    return sum * 1000;
  }

  // 设置Cookie的方法
  bice.setCookie = function(cookieName, cookieInfo) {
    var str = [];
    // 判断参数类型
    if (typeof cookieInfo == 'string') {
      str = cookieInfo;
    } else {
      if (typeof cookieInfo.values == 'object') {
        for (var o in cookieInfo.values) {
          str.push(o + '=' + cookieInfo.values[o] + '&');
        }
        str = str.join('').slice(0, -1);
      } else {
        str = cookieInfo.values;
      }
    }
    // 判断时间的存在
    var cookieStr = cookieName + '=' + str;
    if (cookieInfo.expires) {
      cookieStr += ';expires=' + new Date(new Date().getTime() + bice.getDates(cookieInfo.expires)).toGMTString();
    }
    if (cookieInfo.path) {
      cookieStr += ';path=' + cookieInfo.path;
    }
    if (cookieInfo.domain) {
      cookieStr += ';domain=' + cookieInfo.domain;
    }
    if (cookieInfo.secure === true) {
      cookieStr += ';secure';
    }
    document.cookie = cookieStr;
  }

  // 删除Cookie的方法
  bice.delCookie = function(cookieName) {
    var getC = document.cookie,
      reg = new RegExp(cookieName + '=[^;]?');
    if (reg.test(getC)) document.cookie = cookieName + '=;expires=' + new Date(-1).toGMTString();
  }

  bice.getTimeUrl = function(url) {
    var iTime = bice.getTimestamp();
    if (url.indexOf('biceflag=') >= 0) {
      url = url.replace(/biceflag=\d{13}/, 'biceflag=' + iTime);
      return url;
    }
    url += (/\?/.test(url)) ? '&' : '?';
    return (url + 'biceflag=' + iTime);
  }

  // used in building ajax data object from one form
  bice._ajaxSetValue = function(obj, name, value) {
    if (value === null) return;
    var val = obj[name];
    if (bice.isString(val)) {
      obj[name] = [val, value];
    } else if ($.isArray(val)) {
      obj[name].push(value);
    } else {
      obj[name] = value;
    }
  }

  // used in building ajax data object from one form
  bice._ajaxFieldValue = function(domNode) {
    var ret = null,
      type = (domNode.type || '').toLowerCase();
    if (domNode.name && type && !domNode.disabled) {
      if (type === 'radio' || type === 'checkbox') {
        if (domNode.checked) {
          ret = domNode.value
        }
      } else if (domNode.multiple) {
        ret = [];
        $('option', domNode).each(function() {
          if (this.selected) {
            ret.push(this.value);
          }
        });
      } else {
        ret = domNode.value;
      }
    }
    return ret;
  }

  // used in building ajax data object from one form
  bice._ajaxFormToObj = function(form) {
    if (!form) return {};
    form = bice.isString(form) ? $('#' + form).get(0) : form;
    var ret = {},
      exclude = 'file|submit|image|reset|button|';
    $.each(form.elements, function(i, e) {
      var name = e.name,
        type = (e.type || '').toLowerCase();
      if (name && type && exclude.indexOf(type) === -1 && !e.disabled) {
        bice._ajaxSetValue(ret, name, bice._ajaxFieldValue(e));
      }
    });
    return ret;
  }

  bice._ajaxOptions = function(url, data, args) {
    var options = {};
    url = bice.getTimeUrl(url);
    if (arguments.length === 1) {
      options = url;
    } else {
      options = args || {};
      options['url'] = url;
      if (data) {
        if (bice.isString(data)) {
          //data is a form id
          $.extend(options, {
            data: bice._ajaxFormToObj(data)
          });
        } else {
          $.extend(options, {
            data: data
          });
        }
      }
    }
    //console.dir(options);
    return options;
  }

  // 异步请求
  bice.asyncXhr = function(url, data, args) {
    $.ajax(bice._ajaxOptions(url, data, args));
  }

  // ajax call with GET type
  bice.asyncXhrGet = function(url, data, args) {
    var options = bice._ajaxOptions(url, data, args);
    options['type'] = 'GET';
    $.ajax(options);
  }

  // ajax call with POST type
  bice.asyncXhrPost = function(url, data, args) {
    var options = bice._ajaxOptions(url, data, args);
    options['type'] = 'POST';
    $.ajax(options);
  }

  // 同步请求
  bice.syncXhr = function(url, data, args) {
    var _data, options = bice._ajaxOptions(url, data, args);
    $.extend(options, {
      async: false,
      success: function(data, textStatus) {
        _data = data;
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        _data = {};
        var exception = {};
        exception['message'] = 'Error occurs when fetching data from url:' + this.url;
        exception['cause'] = textStatus ? textStatus : errorThrown;
        _data['exception'] = exception;
      }
    });
    $.ajax(options);
    return _data;
  }

  // ajax sync call with GET type
  bice.syncXhrGet = function(url, data, args) {
    if (arguments.length === 1) {
      url['type'] = 'GET';
    } else {
      args = $.extend({}, args, {
        type: 'GET'
      });
    }
    return bice.syncXhr(url, data, args);
  }

  // ajax sync call with POST type
  bice.syncXhrPost = function(url, data, args) {
    if (arguments.length === 1) {
      url['type'] = 'POST';
    } else {
      args = $.extend({}, args, {
        type: 'POST'
      });
    }
    return bice.syncXhr(url, data, args);
  }

  bice.checkEmail = function(o, reg) {
    try {
      return (reg || rEmail).test(o);
    } catch (e) {
      return false;
    }
  }
  bice.checkMobile = function(o, reg) {
    try {
      return (reg || rMobile).test(o);
    } catch (e) {
      return false;
    }
  }
  bice.isString = function(o) {
    return toString.call(o) === '[object String]';
  }

  // 判断图片是否加载完毕
  bice.checkImgLoad = function(img, src, callBack) {
    var $img = $(img);
    var wait = function(dtd) {
      // 新建一个Deferred对象
      var dtd = $.Deferred();
      var tasks = function() {
        if (src) {
          $('<img src="' + src + '" />').load(function() {
            // 改变Deferred对象的执行状态
            dtd.resolve();
          });
        } else {
          dtd.resolve();
        }
      }
      tasks();
      // 返回promise对象
      return dtd.promise();
    }

    $.when(wait()).done(function() {
      callBack && $.isFunction(callBack) && callBack($img, src);
    }).fail(function() {});
  }

  // 创建可重用的构造函数
  var Ctor = function() {};

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other bice
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1:
        return function(value) {
          return func.call(context, value);
        };
      case 2:
        return function(value, other) {
          return func.call(context, value, other);
        };
      case 3:
        return function(value, index, collection) {
          return func.call(context, value, index, collection);
        };
      case 4:
        return function(accumulator, value, index, collection) {
          return func.call(context, accumulator, value, index, collection);
        };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value == null) return bice.identity;
    if (bice.isFunction(value)) return optimizeCb(value, context, argCount);
    if (bice.isObject(value)) return bice.matches(value);
    return bice.property(value);
  };
  bice.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 0; index < length; index++) {
        var source = arguments[index],
          keys = keysFunc(source),
          l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!bice.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  bice.each = bice.forEach = function(obj, iteratee, context) {
    if (obj == null) return obj;
    iteratee = optimizeCb(iteratee, context);
    var i, length = obj.length;
    if (length === +length) {
      for (i = 0; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = bice.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  bice.map = bice.collect = function(obj, iteratee, context) {
    if (obj == null) return [];
    iteratee = cb(iteratee, context);
    var keys = obj.length !== +obj.length && bice.keys(obj),
      length = (keys || obj).length,
      results = Array(length),
      currentKey;
    for (var index = 0; index < length; index++) {
      currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  bice.reduce = bice.foldl = bice.inject = function(obj, iteratee, memo, context) {
    if (obj == null) obj = [];
    iteratee = optimizeCb(iteratee, context, 4);
    var keys = obj.length !== +obj.length && bice.keys(obj),
      length = (keys || obj).length,
      index = 0,
      currentKey;
    if (arguments.length < 3) {
      memo = obj[keys ? keys[index++] : index++];
    }
    for (; index < length; index++) {
      currentKey = keys ? keys[index] : index;
      memo = iteratee(memo, obj[currentKey], currentKey, obj);
    }
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  bice.reduceRight = bice.foldr = function(obj, iteratee, memo, context) {
    if (obj == null) obj = [];
    iteratee = optimizeCb(iteratee, context, 4);
    var keys = obj.length !== +obj.length && bice.keys(obj),
      index = (keys || obj).length,
      currentKey;
    if (arguments.length < 3) {
      memo = obj[keys ? keys[--index] : --index];
    }
    while (index-- > 0) {
      currentKey = keys ? keys[index] : index;
      memo = iteratee(memo, obj[currentKey], currentKey, obj);
    }
    return memo;
  };

  // **Transform** is an alternative to reduce that transforms `obj` to a new
  // `accumulator` object.
  bice.transform = function(obj, iteratee, accumulator, context) {
    if (accumulator == null) {
      if (bice.isArray(obj)) {
        accumulator = [];
      } else if (bice.isObject(obj)) {
        var Ctor = obj.constructor;
        accumulator = baseCreate(typeof Ctor == 'function' && Ctor.prototype);
      } else {
        accumulator = {};
      }
    }
    if (obj == null) return accumulator;
    iteratee = optimizeCb(iteratee, context, 4);
    var keys = obj.length !== +obj.length && bice.keys(obj),
      length = (keys || obj).length,
      index, currentKey;
    for (index = 0; index < length; index++) {
      currentKey = keys ? keys[index] : index;
      if (iteratee(accumulator, obj[currentKey], currentKey, obj) === false) break;
    }
    return accumulator;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  bice.find = bice.detect = function(obj, predicate, context) {
    var key;
    if (obj.length === +obj.length) {
      key = bice.findIndex(obj, predicate, context);
    } else {
      key = bice.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  bice.filter = bice.select = function(obj, predicate, context) {
    var results = [];
    if (obj == null) return results;
    predicate = cb(predicate, context);
    bice.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  bice.reject = function(obj, predicate, context) {
    return bice.filter(obj, bice.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  bice.every = bice.all = function(obj, predicate, context) {
    if (obj == null) return true;
    predicate = cb(predicate, context);
    var keys = obj.length !== +obj.length && bice.keys(obj),
      length = (keys || obj).length,
      index, currentKey;
    for (index = 0; index < length; index++) {
      currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  bice.some = bice.any = function(obj, predicate, context) {
    if (obj == null) return false;
    predicate = cb(predicate, context);
    var keys = obj.length !== +obj.length && bice.keys(obj),
      length = (keys || obj).length,
      index, currentKey;
    for (index = 0; index < length; index++) {
      currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `includes` and `include`.
  bice.contains = bice.includes = bice.include = function(obj, target, fromIndex) {
    if (obj == null) return false;
    if (obj.length !== +obj.length) obj = bice.values(obj);
    return bice.indexOf(obj, target, typeof fromIndex == 'number' && fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  bice.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = bice.isFunction(method);
    return bice.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  bice.pluck = function(obj, key) {
    return bice.map(obj, bice.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  bice.where = function(obj, attrs) {
    return bice.filter(obj, bice.matches(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  bice.findWhere = function(obj, attrs) {
    return bice.find(obj, bice.matches(attrs));
  };

  // Return the maximum element (or element-based computation).
  bice.max = function(obj, iteratee, context) {
    var result = -Infinity,
      lastComputed = -Infinity,
      value, computed;
    if (iteratee == null && obj != null) {
      obj = obj.length === +obj.length ? obj : bice.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      bice.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  bice.min = function(obj, iteratee, context) {
    var result = Infinity,
      lastComputed = Infinity,
      value, computed;
    if (iteratee == null && obj != null) {
      obj = obj.length === +obj.length ? obj : bice.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      bice.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  bice.shuffle = function(obj) {
    var set = obj && obj.length === +obj.length ? obj : bice.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = bice.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  bice.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (obj.length !== +obj.length) obj = bice.values(obj);
      return obj[bice.random(obj.length - 1)];
    }
    return bice.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  bice.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    return bice.pluck(bice.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      return bice.comparator(left.criteria, right.criteria) || left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = cb(iteratee, context);
      bice.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  bice.groupBy = group(function(result, value, key) {
    if (bice.has(result, key)) result[key].push(value);
    else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  bice.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  bice.countBy = group(function(result, value, key) {
    if (bice.has(result, key)) result[key]++;
    else result[key] = 1;
  });

  // Safely create a real, live array from anything iterable.
  bice.toArray = function(obj) {
    if (!obj) return [];
    if (bice.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return bice.map(obj, bice.identity);
    return bice.values(obj);
  };

  // Return the number of elements in an object.
  bice.size = function(obj) {
    if (obj == null) return 0;
    return obj.length === +obj.length ? obj.length : bice.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  bice.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var pass = [],
      fail = [];
    bice.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  bice.first = bice.head = bice.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return bice.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  bice.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  bice.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return bice.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  bice.rest = bice.tail = bice.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  bice.compact = function(array) {
    return $.grep(array, function(v, i) {
      if (($.isPlainObject(v) && $.isEmptyObject(v))) {
        return false;
      }
      if ($.isArray(v) && v.length == 0) {
        return false;
      }
      return v;
    });
    //return bice.filter(array, bice.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [],
      idx = 0,
      value;
    for (var i = startIndex || 0, length = input && input.length; i < length; i++) {
      value = input[i];
      if (value && value.length >= 0 && (bice.isArray(value) || bice.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0,
          len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  bice.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  bice.without = function(array) {
    return bice.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  bice.uniq = bice.unique = function(array, isSorted, iteratee, context) {
    if (array == null) return [];
    if (!bice.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = array.length; i < length; i++) {
      var value = array[i],
        computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!bice.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!bice.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  bice.union = function() {
    return bice.uniq(flatten(arguments, true, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  bice.intersection = function(array) {
    if (array == null) return [];
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = array.length; i < length; i++) {
      var item = array[i];
      if (bice.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!bice.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  bice.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return bice.filter(array, function(value) {
      return !bice.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  bice.zip = function(array) {
    if (array == null) return [];
    var length = bice.max(arguments, 'length').length;
    var results = Array(length);
    while (length-- > 0) {
      results[length] = bice.pluck(arguments, length);
    }
    return results;
  };

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  bice.unzip = function(array) {
    return bice.zip.apply(null, array);
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  bice.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, length = list.length; i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  bice.indexOf = function(array, item, isSorted) {
    var i = 0,
      length = array && array.length;
    if (typeof isSorted == 'number') {
      i = isSorted < 0 ? Math.max(0, length + isSorted) : isSorted;
    } else if (isSorted && length) {
      i = bice.sortedIndex(array, item);
      return array[i] === item ? i : -1;
    }
    for (; i < length; i++)
      if (array[i] === item) return i;
    return -1;
  };

  bice.lastIndexOf = function(array, item, from) {
    var idx = array ? array.length : 0;
    if (typeof from == 'number') {
      idx = from < 0 ? idx + from + 1 : Math.min(idx, from + 1);
    }
    while (--idx >= 0)
      if (array[idx] === item) return idx;
    return -1;
  };

  // Returns the first index on an array-like that passes a predicate test
  bice.findIndex = function(array, predicate, context) {
    predicate = cb(predicate, context);
    var length = array != null ? array.length : 0;
    for (var i = 0; i < length; i++) {
      if (predicate(array[i], i, array)) return i;
    }
    return -1;
  };

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  bice.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0,
      high = array.length;
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (bice.comparator(iteratee(array[mid]), value) < 0) low = mid + 1;
      else high = mid;
    }
    return low;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  bice.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (bice.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  bice.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!bice.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    return function bound() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  bice.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    return function bound() {
      var position = 0;
      var args = boundArgs.slice();
      for (var i = 0, length = args.length; i < length; i++) {
        if (args[i] === bice) args[i] = arguments[position++];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  bice.bindAll = function(obj) {
    var i, length = arguments.length,
      key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = bice.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  bice.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!bice.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  bice.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function() {
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  bice.defer = bice.partial(bice.delay, bice, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  bice.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : bice.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = bice.now();
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
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  bice.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = bice.now() - timestamp;

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
      timestamp = bice.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  bice.wrap = function(func, wrapper) {
    return bice.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  bice.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  bice.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  bice.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  bice.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  bice.once = bice.partial(bice.before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{
    toString: null
  }.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['constructor', 'valueOf', 'isPrototypeOf', 'toString',
    'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'
  ];

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var proto = typeof obj.constructor === 'function' ? FuncProto : ObjProto;

    while (nonEnumIdx--) {
      var prop = nonEnumerableProps[nonEnumIdx];
      if (prop === 'constructor' ? bice.has(obj, prop) : prop in obj &&
        obj[prop] !== proto[prop] && !bice.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  bice.keys = function(obj) {
    if (!bice.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj)
      if (bice.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  bice.keysIn = function(obj) {
    if (!bice.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  bice.values = function(obj) {
    var keys = bice.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  bice.pairs = function(obj) {
    var keys = bice.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  bice.invert = function(obj) {
    var result = {};
    var keys = bice.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  bice.functions = bice.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (bice.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  bice.extend = createAssigner(bice.keysIn);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  bice.assign = createAssigner(bice.keys);

  // Returns the first key on an object that passes a predicate test
  bice.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = bice.keys(obj),
      key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  bice.pick = function(obj, iteratee, context) {
    var result = {},
      key;
    if (obj == null) return result;
    if (bice.isFunction(iteratee)) {
      iteratee = optimizeCb(iteratee, context);
      for (key in obj) {
        var value = obj[key];
        if (iteratee(value, key, obj)) result[key] = value;
      }
    } else {
      var keys = flatten(arguments, false, false, 1);
      obj = new Object(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        key = keys[i];
        if (key in obj) result[key] = obj[key];
      }
    }
    return result;
  };

  // Return a copy of the object without the blacklisted properties.
  bice.omit = function(obj, iteratee, context) {
    if (bice.isFunction(iteratee)) {
      iteratee = bice.negate(iteratee);
    } else {
      var keys = bice.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !bice.contains(keys, key);
      };
    }
    return bice.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  bice.defaults = function(obj) {
    if (!bice.isObject(obj)) return obj;
    for (var i = 1, length = arguments.length; i < length; i++) {
      var source = arguments[i];
      for (var prop in source) {
        if (obj[prop] === void 0) obj[prop] = source[prop];
      }
    }
    return obj;
  };

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  bice.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) bice.assign(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  bice.clone = function(obj) {
    if (!bice.isObject(obj)) return obj;
    return bice.isArray(obj) ? obj.slice() : bice.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  // bice.tap = function(obj, interceptor) {
  //     interceptor(obj);
  //     return obj;
  // };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    //if (a instanceof bice) a = a._wrapped;
    //if (b instanceof bice) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
        // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor,
        bCtor = b.constructor;
      if (aCtor !== bCtor && !(bice.isFunction(aCtor) && aCtor instanceof aCtor &&
          bice.isFunction(bCtor) && bCtor instanceof bCtor) &&
        ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = bice.keys(a),
        key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (bice.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(bice.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  bice.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  bice.isEmpty = function(obj) {
    if (obj == null) return true;
    if (bice.isArray(obj) || bice.isString(obj) || bice.isArguments(obj)) return obj.length === 0;
    for (var key in obj)
      if (bice.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  bice.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  bice.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  bice.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  bice.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    bice['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!bice.isArguments(arguments)) {
    bice.isArguments = function(obj) {
      return bice.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around an IE 11 bug (#1621).
  // Work around a Safari 8 bug (#1929)
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    bice.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  bice.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  bice.isNaN = function(obj) {
    return bice.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  bice.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  bice.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  bice.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  bice.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Keep the identity function around for default iteratees.
  bice.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  bice.constant = function(value) {
    return function() {
      return value;
    };
  };

  bice.noop = function() {};

  bice.property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Generates a function for a given object that returns a given property (including those of ancestors)
  bice.propertyOf = function(obj) {
    return obj == null ? function() {} : function(key) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of `key:value` pairs.
  bice.matches = function(attrs) {
    var pairs = bice.pairs(attrs),
      length = pairs.length;
    return function(obj) {
      if (obj == null) return !length;
      obj = new Object(obj);
      for (var i = 0; i < length; i++) {
        var pair = pairs[i],
          key = pair[0];
        if (pair[1] !== obj[key] || !(key in obj)) return false;
      }
      return true;
    };
  };

  // Default internal comparator for determining whether a is greater (1),
  // equal (0) or less than (-1) some object b
  bice.comparator = function(a, b) {
    if (a === b) return 0;
    var isAComparable = a >= a,
      isBComparable = b >= b;
    if (isAComparable || isBComparable) {
      if (isAComparable && !isBComparable) return -1;
      if (isBComparable && !isAComparable) return 1;
    }
    return a > b ? 1 : (b > a) ? -1 : 0;
  };

  // Run a function **n** times.
  // bice.times = function(n, iteratee, context) {
  //     var accum = Array(Math.max(0, n));
  //     iteratee = optimizeCb(iteratee, context, 1);
  //     for (var i = 0; i < n; i++) accum[i] = iteratee(i);
  //     return accum;
  // };

  // Return a random integer between min and max (inclusive).
  bice.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  bice.now = Date.now || function() {
    return new Date().getTime();
  };

  // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = bice.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + bice.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  bice.escape = createEscaper(escapeMap);
  bice.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  bice.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return bice.isFunction(value) ? value.call(object) : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  bice.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  bice.templateSettings = {
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
    escape: /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'": "'",
    '\\': '\\',
    '\r': 'r',
    '\n': 'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  bice.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = bice.defaults({}, settings, bice.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':bice.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', 'bice', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, bice);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  bice.chain = function(obj) {
    var instance = bice(obj);
    instance._chain = true;
    return instance;
  };

  bice.boolean = function(str) {
    return typeof str == 'string' ? str == 'true' : str;
  }
  return bice;
})
