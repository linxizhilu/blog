Fixed模板必读及调用方法
==============================
## Fixed模板介绍
该模板写的初衷是模拟gucci官网的监听滚动并且在指定位置改变dom元素的position样式，从而实现dom灵活改变定位状态的效果，现以封装成模板，通过参数传递，可以方便调用，也可以自定义结构，当然前提是你对`spice`模板有足够的了解。
<br>
<br>
## Fixed模板默认配置项
该`Fixed`插件的默认`config`(为了跟全局`config`混淆，更改为`options`)文件如下:
```javascript
options:{
    config : spice.config,                          //这是全局config
    standard: {                                     //当前边界下的参数配置
        open:true,                                  //是否启用
        baseEle: '.spice-fixed-change-rel-btm',     //底部的dom元素，默认已经在模板调用时生成，如果以插件形式调用，需传入，要根据该dom的offset值作计算
        rtoFele: {                                  //relative元素 to fixed元素的对象 ,配合baseEle撑起父容器的高度
            ele: '.spice-fixed-change-rel-fixed',   //选择器
            offset : 0                              //配置在距bottom底边offset偏移量的情况下进行转换
        },
        ftoAeles:[                                  //与baseEle和rtoFele平级的默认Wiefixed并需转换为absolute的元素集合
            //     {
            //     ele: '.spice-fixed-change-right',//包含一个选择器，这些元素可以直接写在模板里面
            //     offset: 80                       //配置在距bottom底边offset偏移量的情况下进行转换
            // }
        ]
    },
    medium:{
        open:false,
    },
    small:{
        open:false,
    },
    checkRetina:false
}
```
现说明各对象下面字段的意思：
<br>
1.	`config`字段，为`spice`全局`config`对象（可以参考`spice`文档了解），主要包含相应的边界配置项,下面的`small`，`medium`，`standard`要与之对应，需要注意的是如果使用自定义`config`中的`resize`边界，请将`useDefaultConfig`设置为`false`，然后传入与`config`相对应的边界配置项，请务必包含各边界对象中的`key`值。<br>
2.	`small`、`medium`、`standard`这几个key值是跟`config`中的`key`值想对应的。<br>
3.  `checkRetina`是否检测高清屏，默认为false。<br>
<br>
<br>

## Fixed模板API

* `handle` 方法 ，初始化每次滚动时调用的事件函数，一般在浏览器出现resize时触发。
* `instanceAry` 方法，返回调用过改插件的所有dom集合。
* `instanceAry` 方法，返回所有的调用过该插件的实例模板
* `destory`方法， 销毁该插件生成的数据。
* `animationFrame`方法，使用它可以调用兼容浏览器的requestAnimationFrame方法

<br>
<br>
## Fixed模板调用方法
一般调用方法如下:
```javascript
<article class="spice-article spice-Fixed-wrapper"
        spice-data-widget-config = "{}"
        spice-data-url = ""
        >
</article>
```
1. 里面的`spice-data-url`是必传的，这个`json`文件里面放的是数据的配置项，在项目使用中可以传入自己的配置路径,一般是相对路径。
2. 一般`spice-data-widget-config`是不需要传的，这个只有在多插件混合调用的情况下才会使用到。

<br>
<br>

### Fixed常用调用方法#

* 通过数据配置调用其它插件，代码为：
```javascript
<article class="spice-article spice-fixed-wrapper"
        spice-data-widget-config = "{}"
        spice-data-url = "../data/fixed/fixed-data-standard.json"
        >
    <div class="spice-revise-slot"></div>   //该代码为fixed元素to absolute的元素，直接写在article里面即可
</article>
```
其中json数据格式为：
```javascript
{
    "content":{
        "relFixed":{
            "slot":"slot-fixed-standard-relFixed",
            "url":"../data/revise/revise-data-standard-img.json",
            "config":"{}",
            "className":"spice-article spice-Revise-wrapper"
        },
        "relBtm":{
            "slot":"slot-fixed-standard-relBtm",
            "url":"",
            "config":""
        }
    }
}
```
<br>
