# js模块化加载规范
## 四大规范
我反正是没想到，最后一门脚本语言竟然发展到有了前后端通吃的能力。既然有了这个能力，就慢慢的规范起来了，尤其是在`nodejs`流行以后，不使用模块化加载，后端脚本之间的依赖，就会很混乱，难以维护。首先是服务端的`CommonJS`规范发展起来的，再用`node`写脚本的时候感觉还挺方便，就想把这套规范移植到浏览器端，但是服务端跟浏览器端有一个逆天的区别就是，服务端所有资源都是其本地资源，而浏览器的资源都是通过远程服务器加载，非本地的，这就造成了模块加载时间上的不同，所以服务端`CommonJS`规范的加载是同步的，其加载时间只是读取硬盘数据的时间，浏览器端的加载为了减少对浏览器的阻塞，通常使用异步加载。浏览器端的常见规范为已`requirejs`为首的`AMD`规范和已`seajs`为首的`CMD`规范。所以常见的`JS`模块化加载规范为这三种：
1. `CommonJS`规范
2. `AMD`规范
3. `CMD`规范

但是`ES6`横空出世了，它对服务器端已经浏览器端的模块化加载做了统一，使用`import` 和 `export`命令实现模块的导出及加载，在**阮一峰**大神编写的 [ECMAScript 6入门](http://es6.ruanyifeng.com/#docs/module) 中有一段对ES6模板库的介绍：
> * `ES6` 模块的设计思想，是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。`CommonJS` 和 `AMD` 模块，都只能在运行时确定这些东西。

## es6模块机制的不同

ES6的加载为 **编译时加载** ，引入的非对象不能赋值,而其它的`CommonJS`、`AMD`、`CMD`等都为 **运行时加载** ，可以赋值给变量。
言归正传， `CommonJS` 是用于服务端的，同其它规范的主要区别为同步加载，只要依赖顺序对，就可以一次性全部加载（预加载？？），也可以用到时加载（懒加载？？）。
再说`AMD`和`CMD`，两者同为浏览器端加载规范，也都是以异步加载的方式实现的，但使用上最显著的区别就是：
> 1. AMD是预加载:一次性把依赖文件全部加载完毕，然后再执行，主函数写在回调用。
> 2. CMD是懒加载：允许你在使用的地方进行文件的加载，当然这样会等待文件加载完再执行。

但根据社区各个大神的说法，两者各有千秋，用哪个随自己的方便，只要记住一点，规范只是为了方便我们维护的，一切方便就好。

## 各规范的一般写法

CommonJS的书写方法:
```javascript
// 导出模块,someModule.js
var someModule={};
moudle.exports = someModule;
// 导入模块,index.js
var someModule = require('./someModule');
```

AMD规范写法:
```javascript
// 导出模块，somemodule.js
define('someModule',['dep'],function(dep){
  // module code
})
// config.js
require.config({
  someModule:'someModule'
})
// 引入模块
require(['someModule'],function(someModule){
  // our code
})
```
CMD规范写法:
```javascript
define(function(require, exports, module) {

  // 模块代码

});
```
ES6模块写法:
```javascript
// 导出模块someModule.js,关键字声明似的
export var someModule={};
// 引入模块
import {* as someModule} from './someModule'
```
当然，这都是最基本的写法了，如果想写点不同的，就要好好研究下各规范的算法。
参考：
1. [彻底弄懂CommonJS和AMD/CMD！](http://www.cnblogs.com/chenguangliang/p/5856701.html)
2. [SeaJS 与 RequireJS 的异同](https://github.com/seajs/seajs/issues/277)
