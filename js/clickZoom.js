
(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ?
    module.exports = factory() :
    typeof define === 'function' && define.amd ?
    define(factory) :
    (global.clickZoom = factory());
})(window,function(){
var tempInstanceAry = [];
var animationFrame = (function(window) {　　
    return window.requestAnimationFrame || //IE10以及以上版本，以及最新谷歌，火狐版本
　　　　　　window.webkitRequestAnimationFrame || //谷歌老版本
　　　　　　window.mozRequestAnimationFrame || //火狐老版本
　　　　　　function(callback) { //IE9以及以下版本    　　　　　　　　　　
            window.setTimeout(callback, 1000 / 60); //这里强制让动画一秒刷新60次，这里之所以设置为16.7毫秒刷新一次，是因为requestAnimationFrame默认也是16.7毫秒刷新一次。
        }
})(window);

function ClickZoom(selector, options) {
    if (!(this instanceof ClickZoom)) return new ClickZoom(selector, options);
    this.selector = selector;
    this.elem = typeof this.selector === 'string' ? $(selector) : this.selector;
    this.defineOption = options;
    this.options = $.extend(true, {}, this.options, options);
    this.debounceOpt = {};
    this.instanceNum = tempInstanceAry.push({
        selector: this.selector
    });
    this.activeIndex = 0;
    this.init();
};
ClickZoom.prototype = $.extend(true, {}, {
    options: {
        config: $.bice.config,
        standard: {
            open: true,
            scale: 3,
            padding: 0,
            hideScroll: true,
            doubleTouch: false,
            imgAttr: 'src',
            mouseDrag: true,
            transitionDuration: 0.5,
            direction:false,
            smallSizeMove:false,
            center:false
        },
        medium: {
            open: true,
            scale: 3,
            padding: 0,
            hideScroll: false,
            doubleTouch: true,
            imgAttr: 'src',
            mouseDrag: false,
            zoomPoint: true,
            transitionDuration: 0.5,
            direction:false,
            smallSizeMove:false,
            center:false
        },
        small: {
            open: true,
            scale: 3,
            padding: 0,
            hideScroll: true,
            doubleTouch: true,
            imgAttr: 'src',
            mouseDrag: true,
            transitionDuration: 0.5,
            direction:false,
            smallSizeMove:false,
            center:false
        },
        checkRetina: false
    },
    init: function() {

        this.drawHtmlWrapper();
        this.computeDebounce();
    },
    handle: function(options) {
        if (!options) return;
        var self = this,
            $elem = self.elem,
            options = options || self.debounceOpt,
            $window = $(window),
            cssStr = '',
            imageStyleObj,
            $zoomWrapper = $('#zoomWrapper'), //自建的img容器
            $zoomImgDom = $('.zoomImg', $zoomWrapper), //自建的img标签，用来存放需要放大的image
            zoomImg_h = 0, //放大后的图片尺寸
            zoomImg_w = 0, //放大后的图片尺寸
            lastPointObj = {
                x: 0,
                y: 0
            }, //上一次鼠标(触摸点)位置
            diff = {}, //用来存放可移动的宽高数据
            imgOffset, //图片偏移的位置
            imgAttr = options.imgAttr, //存放需要放大的图片地址
            initScale = options.scale || 3, //点击初始放大尺寸，默认为3
            padding = options.padding || {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }, //用来设置图片的内补白，随图片放大而放大
            hideScroll = options.hideScroll || false, //放大图片时 是否隐藏滚动条
            direction = options.direction || 　false, //与鼠标同向或反向，true为同向,默认反向
            smallSizeMove = options.smallSizeMove,//图片放大后尺寸小于屏幕尺寸的方向是否运动
            maxScale = options.maxScale || 6, //最大的放大倍数
            minScale = options.minScale || 1, //最小的放大倍数
            firction = options.firction || 0.9, //递减系数，越小递减越快，end后移动的越短
            increaseStandard = options.standard || 20, // 设定少于多少值按速滑处理
            zoomStep = options.zoomStep || 5, //使用双指或滚动缩放时的速度， 1~10
            mouseDrag = options.mouseDrag || false, //是否使用鼠标拖动展示
            zoomPoint = options.zoomPoint || false, //两个值，true为根据点击的点放大，false为直接放大
            transitionDuration = options.transitionDuration,
            center = options.center || false,//设定是否是以图片的中心放大
            // touch事件下面使用的全局变量
            timeFlag = true, //touchmove时的节流阀标识
            animateFlag = true; //动画函数的节流阀
            single_distanceAry = [], //单指时，两点之间的距离
            single_pointsAry = [], //单指时，存放经过的点
            single_pointNums = 0, //单指时，存放的数据个数
            single_stdPointNum = 5, //设定存放点的数量
            doublePointsFlag = false, //是否为双指
            double_firstPoint = null, //存放第一个双点
            double_lastPoint = null, //存放最后一次双点
            closeEventName = mouseDrag ? 'dblclick' : 'tap', //如果有mousedown事件，就使用dblclick关闭，否则还是tap事件
            zoomStep /= 100,
            openFlag = true;
        /*
         *   初始化完成后，返回图片点击事件处理函数
         */
        return function(event) {
            var $dom = $(this),
                $imgDomOft = $dom.offset(),
                src = $dom.attr(imgAttr),
                moveFlag = true,
                currentScrollTop = $window.scrollTop(),
                currentScrollLeft = $window.scrollLeft(),
                win_w = $window.width(),
                win_h = $window.height(),
                imgHeight = parseInt($dom.css('height')),
                imgWidth = parseInt($dom.css('width')),
                imgOffset,
                scale = initScale,
                imgCenterPoint={
                  y :parseInt( $elem[0].getBoundingClientRect().top + parseInt($elem.css('height'))/2 ),
                  x :parseInt( $elem[0].getBoundingClientRect().left+ parseInt($elem.css('width'))/2 )
                },
                initX = center ? imgCenterPoint.x : event.clientX ? event.clientX : imgCenterPoint.x,
                initY = center ? imgCenterPoint.y : event.clientY ? event.clientY : imgCenterPoint.y,
                mousePos = zoomPoint ? new Point(win_w / 2, win_h / 2) : new Point(initX, initY), //鼠标点击的点
                pointOnImgPos = new Point(mousePos.x + currentScrollLeft - $imgDomOft.left, mousePos.y + currentScrollTop - $imgDomOft.top),
                // 该点在图片上的位置，比例
                pointOnImgRatio = {
                    x: pointOnImgPos.x / imgWidth,
                    y: pointOnImgPos.y / imgHeight
                },
                // 存取当前图片的宽和高，及offset
                imgObj = {
                    x: $imgDomOft.left - currentScrollLeft,
                    y: $imgDomOft.top - currentScrollTop
                },
                translateX = $imgDomOft.left - $window.scrollLeft(),
                translateY = $imgDomOft.top - $window.scrollTop();
            // 确定图片点开
            openFlag = true;
            // 放大图片显示位置
            lastPointObj = new Point(mousePos.x, mousePos.y);
            // 记录当前的currentScrollTop,然后添加overflow：hidden样式;
            self.scrollTop = currentScrollTop;
            self.scrollLeft = currentScrollLeft;
            if (hideScroll) {
                $('body').addClass('overflowHidden');
            };
            imageStyleObj = {
                'display': 'inline-block',
                'height': imgHeight,
                'width': imgWidth,
                'transform': 'translate3d(' + translateX + 'px,' + translateY + 'px,0)'
            };
            // 更换图片加载事件
            $zoomImgDom
                .css(imageStyleObj)
                .attr('src', src)
                .off('load')
                .on('load', function(e) {
                    imgLoadHandle.call(this, e);
                });
            // 图片加载处理函数
            function imgLoadHandle(e) {
                var $dom = $(this);
                zoomImg_h = imgHeight * scale;
                zoomImg_w = imgWidth * scale;
                diff.h = zoomImg_h - win_h;
                diff.w = zoomImg_w - win_w;
                diff.h = diff.h > 0 ? diff.h : diff.h / 2;
                diff.w = diff.w > 0 ? diff.w : diff.w / 2;
                imgOffset = {
                    x: mousePos.x - zoomImg_w * pointOnImgRatio.x,
                    y: mousePos.y - zoomImg_h * pointOnImgRatio.y
                };

                if ($zoomImgDom.css('transition').indexOf('none') != -1) {
                    $zoomImgDom
                        .css({
                            'transition': 'all ' + transitionDuration + 's ease-out 0s'
                        })
                }
                $zoomImgDom
                    .one('transitionend', function() {
                        var $dom = $(this);
                        $dom.css('transition', 'none');
                        moveFlag = false;
                    });
                imgOffset = updateStatus(imgOffset);
                // 预防moveFlag未监听到
                setTimeout(function() {
                    if (moveFlag) {
                        $dom.css('transition', 'none');
                        moveFlag = false;
                    }
                }, transitionDuration * 1000 + 100)
                if (padding > 0) {
                    $zoomImgDom
                        .css({
                            'padding': margin / scale
                        })
                }
            }
            // 点击后关闭图片放大效果

            if (!$.bice.hasTouch && mouseDrag) {
                $zoomWrapper
                    .css({
                        'opacity': 1,
                        'display': 'block'
                    })
                    .off('mousedown.zoomImg-close')
                    .on('mousedown.zoomImg-close', function(e) {
                        e.preventDefault();
                        $(this)
                            .off('mouseup.zoomImg-close')
                            .on('mouseup.zoomImg-close', function(event) {
                                if (e.clientX === event.clientX && e.clientY === event.clientY) {
                                    closeHandle.call(this, event);
                                }
                                e.preventDefault();
                                  return false;
                            })
                        return false;
                    })
            } else {
                $zoomWrapper
                    .css({
                        'opacity': 1,
                        'display': 'block'
                    })
                    .off('tap' + '.zoomImg-close')
                    .on('tap' + '.zoomImg-close', function(e) {
                        e.preventDefault();
                        closeHandle.call(this, e);
                        return false;
                    });
            }

            function closeHandle(e) {
                if (moveFlag) return;
                openFlag = false;
                var $dom = $(this);
                if (imgObj.x === imgOffset.x && imgObj.y === imgOffset.y) {
                    hide()
                } else {
                    cssStr = 'translate3d(' + imgObj.x + 'px, ' + imgObj.y + 'px, 0px) scale3d(' + 1 + ', ' + 1 + ', 1)';

                    $zoomImgDom
                        .css({
                          'transition': 'all ' + transitionDuration + 's ease-out 0s'
                        })
                        .css({
                            'transform': cssStr
                        })
                        .one('transitionend', function() {
                            hide();
                        });
                }

                function hide() {
                    $dom
                        .off('mousemove wheel mousedown touchstart touchmove touchend')
                        .fadeTo(200, 0, function() {
                            $dom.css({
                                'display': 'none'
                            });
                        })
                }
                if (hideScroll) {
                    $('body').removeClass('overflowHidden');
                    $window.scrollTop(self.scrollTop).scrollLeft(self.scrollLeft);
                }
            }
            if ($.bice.hasTouch) {
                touchHandle.call($zoomWrapper);
            } else {
                mouseHandle.call($zoomWrapper);
            }
            // 没有touch事件时，使用pc端跟鼠标运动相反的方向的动画效果
            function mouseHandle() {

                var $dom = $(this);
                $dom
                    .off('mousemove.zoomImg')
                    .on('mousemove.zoomImg', function(e) {
                        if(!openFlag)return;
                        mouseMoveHandle.call(this, e);
                    })
                    .off('wheel.zoomImg DOMMouseScroll.zoomImg')
                    .on('wheel.zoomImg DOMMouseScroll.zoomImg', function(e) {
                        if(!openFlag)return;
                        e.preventDefault();
                        mouseWheelHanle.call(this, e);
                        return false;
                    });
                if (mouseDrag) {
                    $dom
                        .off('mousemove.zoomImg mousedown.zoomImg')
                        .on('mousedown.zoomImg', function(e) {
                            if(!openFlag)return;
                            mousedownHandle.call(this, e);
                        })
                        .off('mouseup.zoomImg')
                        .on('mouseup.zoomImg', function(e) {
                            if(!openFlag)return;
                            var $dom = $(this);
                            $dom
                                .off('mousemove.zoommove');
                            singlePointEndHandle();
                        })
                        .off('mouseleave.zoomImg')
                        .on('mouseleave.zoomImg', function() {
                            if(!openFlag)return;
                            var $dom = $(this);
                            $dom.off('mousemove.zoommove');
                        })
                }
            }
            // mousemove事件处理函数
            function mouseMoveHandle(e) {
                var x = e.clientX,
                    y = e.clientY,
                    px,py;
                // 只要鼠标在事件对象上面,就会一直触发mousemove事件，该判断用来优化防止非用户移动的情况下持续执行代码
                if (lastPointObj.x === x && lastPointObj.y === y) {
                    return;
                };
                lastPointObj = new Point(x, y);
                if (direction) {
                  if(smallSizeMove){
                    px = diff.w > 0 ? parseInt(( x / win_w) * diff.w*2):-parseInt(( 1 - x / win_w) * diff.w);
                    py = diff.y > 0 ? parseInt(( y / win_y) * diff.h*2):-parseInt(( 1 - y / win_y) * diff.y)
                  }else{
                    px = -parseInt(( 1 - x / win_w) * diff.w);
                    py = -parseInt((1 - y / win_h) * diff.h);
                  }
                  imgOffset = new Point(px, py);
                } else {
                    if(smallSizeMove){
                      px =  diff.w > 0 ?  parseInt(( x / win_w) * diff.w*2) : -parseInt( x / win_w * diff.w*2);
                      py =  diff.y > 0 ?  parseInt(( y / win_y) * diff.h*2) : -parseInt( y / win_h * diff.h);
                    }else{
                      px = -parseInt( x / win_w * diff.w);
                      py = -parseInt( y / win_h * diff.h);
                    }
                    imgOffset = new Point(px, py);
                }
                updateStatus(imgOffset);
            }
            // 滚动放大缩小函数
            function mouseWheelHanle(e) {
                var point = new Point(e.originalEvent.clientX, e.originalEvent.clientY),
                    dir = e.originalEvent.wheelDelta > 0 ? true : false;
                singlePointZoom(point, dir);
            }
            // mousedown处理函数
            function mousedownHandle(e) {
                var $dom = $(this);
                lastPointObj = new Point(e.clientX, e.clientY);
                $dom
                    .off('mousemove.zoommove')
                    .on('mousemove.zoommove', function(e) {
                        var $dom = $(this);
                        // 使用animateFrame动画函数，用来优化touchmove触发次数
                        if (timeFlag) {
                            self.animationFrame(animate);
                            timeFlag = false;
                        }

                        function animate() {
                            timeFlag = true;
                            mouseDragHandle.call($dom, e);
                        };
                        e.preventDefault();
                        e.stopPropagation();
                        e.returnValue = false;
                        return false;
                    })
            }
            // mousedrag拖动函数
            function mouseDragHandle(e) {
                var $dom = $(this);
                if (!isNaN(e.clientX) && !isNaN(e.clientY)) {
                    siglePointHandle.call($dom, e.clientX, e.clientY);
                }
            }
            // 在有touch事件时，使用touch移动的动画效果
            function touchHandle() {
                var $dom = $(this);
                $dom
                    .off('touchstart.zoomImg')
                    .on('touchstart.zoomImg', function(event) {
                        if(!openFlag)return;
                        var touches = event.originalEvent.touches,
                            touchStartEvent = touches[0],
                            touch_listLength = touches.length,
                            tempObj = {};
                        lastPointObj = {};
                        single_distanceAry = [];
                        single_pointsAry = [];
                        double_firstPoint = null;
                        double_pointsAry = [];
                        // 双指放大
                        if (touch_listLength > 1) {
                            doublePointsFlag = true;
                            var touchSecondEvent = touches[1];
                            tempObj.point1 = new Point(touchStartEvent.clientX, touchStartEvent.clientY);
                            tempObj.point2 = new Point(touchSecondEvent.clientX, touchSecondEvent.clientY);
                            tempObj.center = getCenterPoint(tempObj.point1, tempObj.point2);
                            tempObj.distance = getDistance(tempObj.point1, tempObj.point2);
                            double_firstPoint = tempObj;
                        } else {
                            // 单指移动拿到当前触摸点的位置
                            lastPointObj = new Point(touchStartEvent.clientX, touchStartEvent.clientY);
                        }
                        return;
                    })
                    .off('touchmove.zoomImg')
                    .on('touchmove.zoomImg', function(e) {
                        if(!openFlag)return;
                        var $dom = $(this);
                        // 使用animateFrame动画函数，用来优化touchmove触发次数
                        if (timeFlag) {
                            self.animationFrame(animate);
                            timeFlag = false;
                        }

                        function animate() {
                            timeFlag = true;
                            touchMoveHandle.call($dom, e);
                        };
                        e.preventDefault();
                        e.stopPropagation();
                        e.returnValue = false;
                        return false;
                    })
                    .off('touchend.zoomImg')
                    .on('touchend.zoomImg', function(e) {
                        touchendHandle.call(this, e);
                    });
            }
            // 在单指touchend触发时，检测是速滑还是平滑，
            // 1.后面2个点的距离大于20
            // 2.后一个值比前一个值大，就是distance是递增的，有1/2的点符合要求即可
            function touchendHandle(e) {
                var touches = e.originalEvent.touches;
                touch_listLength = touches.length;
                if (doublePointsFlag) {
                    if (touch_listLength <= 1) {
                        setTimeout(function() {
                            doublePointsFlag = false;
                        }, 200);
                    } else {
                        doublePointHandle();
                    }
                    return;
                }
                singlePointEndHandle();
            }
            // 单指touchend处理函数
            function singlePointEndHandle() {
                var i = 1,
                    increaseNum = 0,
                    lastPointDistance,
                    lastPoint,
                    ratio,
                    step = {},
                    cachePoint = {},
                    dir;
                if (single_distanceAry[single_pointNums - 1] < increaseStandard && single_distanceAry[single_pointNums - 2] < increaseStandard) {
                    return;
                }
                // 判断后一个值比前一个值大
                for (; i < single_pointNums; ++i) {
                    if (single_distanceAry[i] - single_distanceAry[i - 1]) {
                        increaseNum++;
                    }
                }
                //数量
                if (increaseNum < single_pointNums / 2) {
                    return;
                }
                lastPointDistance = single_distanceAry[single_pointNums - 1];
                if (single_pointsAry.length === 0) return;
                lastPoint = single_pointsAry[single_pointNums - 1];
                cachePoint = new Point(lastPoint.x, lastPoint.y);
                ratio = computDir(single_pointsAry[0], lastPoint);
                dir = single_pointsAry[0].x > lastPoint.x ? true : false;
                siglePointSlideHandel(cachePoint, lastPointDistance, dir, ratio);
            }
            // 双指touchend处理函数
            function doublePointHandle() {
                // 触发jquery自定义事件
                self.elem.trigger('zoomImg.doublePointEnd');
            };

            function touchMoveHandle(e) {
                var $dom = $(this),
                    touches = e.originalEvent.touches,
                    touch = touches[0];
                // stdout( doublePointsFlag );
                if (doublePointsFlag) {
                    if (options.doubleTouch) {
                        // 取前两个touch的点
                        // stdout(doublePointHandle);
                        doublePointHandle.call($dom, touch, touches[1]);
                    }
                } else {
                    if (!isNaN(touch.clientX) && !isNaN(touch.clientY)) {
                        siglePointHandle.call($dom, touch.clientX, touch.clientY);
                    }
                }
            }
            //单点移动处理函数，只需要传入坐标值就可以了
            function siglePointHandle(x, y) {
                var x = x || 0,
                    y = y || 0;
                if (!lastPointObj || $.isEmptyObject(lastPointObj)) {
                    lastPointObj = new Point(x, y);
                } else {
                    imgOffset.x += (x - lastPointObj.x);
                    imgOffset.y += (y - lastPointObj.y);
                    single_pointNums = single_distanceAry.push(getDistance({
                        x: x,
                        y: y
                    }, lastPointObj));
                    lastPointObj = new Point(x, y);
                    single_pointsAry.push(lastPointObj);
                    if (single_pointNums > single_stdPointNum) {
                        single_distanceAry.shift();
                        single_pointsAry.shift();
                        single_pointNums--;
                    }
                }
                imgOffset = updateStatus(imgOffset);
                return;
            }
            // 模拟单点触摸移动处理函数，用于单点移动完成后续缓冲动画
            function siglePointSlideHandel(lastPoint, maxDistance, dir, ratio) {
                var distance = maxDistance,
                    point = lastPoint,
                    dir = dir || false,
                    ratio = ratio || 1,
                    firction = firction || 0.8,
                    step = {};
                animate();

                function animate() {
                    if (distance > 10) {
                        distance *= firction;
                        step.x = Math.sqrt(Math.pow(distance, 2) / (1 + Math.pow(ratio, 2)));
                        step.y = step.x * ratio;
                        if (dir) {
                            step.x = -step.x;
                            step.y = -step.y;
                        }
                        point.x += step.x;
                        point.y += step.y;
                        //模拟单指继续移动
                        siglePointHandle(point.x, point.y);
                        self.animationFrame(animate);
                    } else {
                        // 触发jquery自定义事件
                        self.elem.trigger('zoomImg.siglePointEnd');
                    }
                }
            }
            // 双指缩放处理函数
            function doublePointHandle(p1, p2) {
                var $dom = $(this),
                    tempObj = {},
                    zoom = false,
                    centerPoint = null;
                tempObj.point1 = new Point(p1.clientX, p1.clientY);
                tempObj.point2 = new Point(p2.clientX, p2.clientY);
                // tempObj.center = getCenterPoint(point1,point2);
                tempObj.distance = getDistance(tempObj.point1, tempObj.point2);
                if (!double_lastPoint || $.isEmptyObject(double_lastPoint)) {
                    double_lastPoint = tempObj;
                    return;
                };
                // 如果最后两个点的距离比第一个点的距离大，说明是放大，反之缩小
                zoom = double_lastPoint.distance >= tempObj.distance ? false : true;
                double_lastPoint = tempObj;
                stdout(double_lastPoint);
                singlePointZoom(double_firstPoint.center, zoom);
            };
            // 单点放大处理函数
            function singlePointZoom(centerPoint, zoom) {
                if (arguments.length < 2) return;
                if (animateFlag) {
                    animateFlag = false;
                    self.animationFrame(animate);
                }
                // animate();
                function animate() {
                    animateFlag = true;
                    centerPoint = centerPoint;
                    scale = zoom ? (scale + 0.05) : (scale - 0.05);
                    scale = Math.max(scale, 1);
                    scale = Math.min(scale, 6);
                    // 获取该点在图片给上的比例
                    pointOnImgRatio = {
                        x: (-imgOffset.x + centerPoint.x) / zoomImg_w,
                        y: (-imgOffset.y + centerPoint.y) / zoomImg_h
                    };
                    zoomImg_w = imgWidth * scale;
                    zoomImg_h = imgHeight * scale;
                    diff.h = zoomImg_h - win_h;
                    diff.w = zoomImg_w - win_w;
                    diff.h = diff.h > 0 ? diff.h : diff.h / 2;
                    diff.w = diff.w > 0 ? diff.w : diff.w / 2;
                    pointOnImgPos = {
                        x: pointOnImgRatio.x * zoomImg_w,
                        y: pointOnImgRatio.y * zoomImg_h
                    };
                    imgOffset = {
                        x: centerPoint.x - pointOnImgPos.x,
                        y: centerPoint.y - pointOnImgPos.y
                    };
                    imgOffset = updateStatus(imgOffset, scale);
                }
            }
            // 设置页面移动
            // @{param} diffObj 计算后的页面的移动位置
            // @{param} diffObj 计算后的页面的移动位置
            function updateStatus(imgOffset, currentScale) {
                var x, y; //边界尺寸
                currentScale = currentScale || scale;
                x = Math.min(imgOffset.x, padding.left);
                x = Math.max(x, -diff.w - padding.right);
                x = imgOffset.x;
                y = Math.min(imgOffset.y, padding.top);
                y = Math.max(y, -diff.h - padding.bottom);
                imgOffset.x = x;
                imgOffset.y = y;
                cssStr = 'translate3d(' + imgOffset.x + 'px, ' + imgOffset.y + 'px, 0px) scale3d(' + currentScale + ', ' + currentScale + ', 1)';
                $zoomImgDom.css('transform', cssStr);
                // 触发jquery自定义事件
                self.elem.trigger('zoomImg.updateStatus', {
                    imgOffset: imgOffset,
                    currentScale: currentScale
                });
                return imgOffset;
            }
        };
    },
    computeDebounce: function() {

        var self = this,
            options = self.options,
            lastMedia = '',
            content, num = 0,
            length = self.elem.length;
        var debounce = $.bice.resizeScreenDebounce({
            checkRetina: options.checkRetina,
            callBack: function(media) {
                if (lastMedia !== media) {
                    self.debounceOpt = options[media];
                    if (self.debounceOpt.open) {
                        self.imgZoomHandle = self.handle(self.debounceOpt);
                        self.drawEvents();
                    } else {
                        self.destory();
                    }
                    lastMedia = media;
                }
            }
        });
        $(window)
            .off('resize.imgZoom' + this.instanceNum)
            .on('resize.imgZoom' + this.instanceNum, function() {
                debounce();
            })
            .trigger('resize.imgZoom' + this.instanceNum);
        !!(self.elem.parent().length > 0) && self.elem.parent().on('$.bice.autoReplaceImageSrc-after', function() {
            num++;
            if (num === length) {
                self.elem = $(self.selector);
                debounce();
                num = 0;
            }
        })
    },
    drawEvents: function() {
        var self = this,
            clickImgHandle = self.imgZoomHandle || self.handle(self.options['standard']);
        self.elem
            .off('tap.imgZoom')
            .on('tap.imgZoom', function(e) {
                e.stopPropagation();
                clickImgHandle.call(this, e);
                return false;
            });
    },
    drawHtmlWrapper: function() {
        if ($('#zoomWrapper').length !== 0) {
            return;
        }
        //生成一个fixed元素用来装放大的元素
        $('<div id="zoomWrapper"><img class="zoomImg" draggable=false/></div>').appendTo('body');
    },
    animationFrame: function(fn) {
        animationFrame(fn);
    },
    checkTransformSupported: function() {
        var pageBody = document.body || document.documentElement;
        var bodyStyle = pageBody.style;
        var transformArr = ['transform', '-webkit-transform', '-moz-transform', '-ms-transform', '-o-transform'];
        var length = transformArr.length;
        var transformObject;
        for (var i = 0; i < length; i++) { // for all kind of css transition we make a test
            if (bodyStyle[transitionTestArr[i]] != null) {
                transformStr = transformArr[i];
                var div = $('<div style="position:absolute;">Translate3d Test</div>');
                $('body').append(div); // try a transformation on a new div each time
                transformObject = new Object();
                transformObject[transformArr[i]] = "translate3d(20px,0,0)";
                div.css(transformObject);
                css3dSupported = ((div.offset().left - $('body').offset().left) == 20); // if translate3d(20px,0,0) via transformArr[i] == 20px the transformation is valid for this browser
                div.empty().remove();
                if (css3dSupported) { // return the kind of transformation supported
                    return {
                        transform: transformArr[i],
                        css3dSupported: css3dSupported
                    };
                }
            }
        }
        return null;
    },
    destory: function() {
        var self = this;
        self.elem.off('click.imgZoom');
    }
})
// 移动端页面输出
function stdout() {
    return;
    var msg = '(',
        html = document.getElementById('logs').innerHTML;
    ([]).forEach.call(arguments, function(item, i) {
        item = typeof item === 'object' ? JSON.stringify(item) : item + '';
        msg += (i + ':' + item + ',');
    })
    msg += ')' + '</br>';

    document.getElementById('logs').innerHTML = ((msg + ',') + html);
    // document.getElementById('logs').innerHTML += (stringify(arguments[0]));
    function stringify(obj) {
        var str = '{';
        for (var key in obj) {
            str += (key + ':' + obj[key])
        }
        if (!key) {
            str += obj
        }

        str += '}';
        return str;
    }
}
// 获取两个点之间的中点
function getCenterPoint(p1, p2) {
    return {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2
    };
}
// 获取两个点之间距离
function getDistance(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}
// 两个点确定一个方形，获取缩放比例
function getScale(lastObj, firstObj) {
    var point1 = lastObj.point1,
        point2 = lastObj.point2,
        point1_1 = firstObj.point1,
        point2_2 = firstObj.point2;
    var ratioX = (point1.x - point2.x) / (point1_1.x - point2_2.x),
        ratioY = (point1.y - point2.y) / (point1_1.y - point2_2.y);
    return Math.max(Math.abs(ratioX), Math.abs(ratioY));
}
// 根据两个num生成点
function Point(x, y) {
    var obj = {
        x: x,
        y: y
    };
    return obj;
}
// 通过两个点，返回两个点移动的X,Y方向的距离比例
function computDir(point1, point2) {
    var ratio = 0,
        diff_x = 0,
        diff_y = 0;
    diff_x = point2.x - point1.x;
    diff_y = point2.y - point1.y;
    ratio = diff_y / diff_x;
    return ratio;
}
ClickZoom.prototype.constructor = ClickZoom;
return ClickZoom;
})
