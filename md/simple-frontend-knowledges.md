# 零碎的前端笔记
## 纯函数
固定的输入总对应固定的输出，即输入仅仅取决于输入。我感觉就像`react`里面的组件一样，同一个状态进去，出来的view肯定就是一样的。
```javascript
function fn(arg){
	return arg + 1;
}
```
↑ 该函数就是简单的纯函数，即输出仅仅取决于输入

```javascript
function fn(){
	return 1;
}
```
↑ 该函数也是简单的纯函数,即返回一个常量

```javascript
var c = 1;
function fn(arg){
	return arg + c;
}
```
↑ 该函数就不是一个纯函数，因为输出要取决于另一个变量c的值

```javascript
function c(){
	return 1;
}
function fn(arg){
	return arg + c();
}
```
↑ 该函数也是纯函数,因为c()的值是一个不变的值

像上面这些纯函数组合起来，就可以构成函数式写法了

## 对象参数里面的this指向

```javascript
var obj = {
			a:'a',
			b:this.a, //这里的this也是指向window
			fn:function(){console.log(this)}, //这里的this指向的是obj本身
			win:function(){console.log(this)}()//这里面的this指向为window
		};
obj.b; //underfinded
obj.fn; //obj
function fn(obj){
	!!obj.fn&&obj.fn()
}
fn(obj) 	//obj {}
```
```javascript
function foo(){
	console.log(this.a);
}
var obj = {
	a:'a',
	foo:foo
}
var a = 'window.a';
foo(); //window.a
obj.foo(); //a
(function(a){a()}(obj.foo)); //window.a
(function(a){a.foo()}(obj)); //a
```
** JS属于按引用求值 **

↑ 通过上面测试可以得出，this当真是变幻莫测

```javascript

```
```javascript
function fn(arg){
	!!arg&&arg()
}
fn({function(){console.log(this)}}) 	//Window
```
↑通过上面测试可以得出，this指向的是Window

## html5语义化优点
1. 去掉或样式丢失的时候能让页面呈现清晰的结构。
2. 对其它非屏幕设备的使用比较友好(设备将根据其自身的条件来合适地显示页面)。
3. 搜索引擎的爬虫也依赖于标记来确定上下文和各个关键字的权重，利于seo。
4. 便于团队开发和维护。

## JS写个二分法查值
二分法存在一个局限性，就是只能对排好顺序的数组进行查找;
```javascript
function bisectionLgorithms(ary,finalVal){
		var count = 0,currentAry,start,end,middle,middleValue,length;
	 return (function computMiddle(ary,finalVal){
			count++;
			currentAry,
			start = 0,
			end = length = ary.length;
			middle = parseInt((start+end)/2),
			middleValue = ary[middle];
			if(count>100)return 'error';
			if(middleValue=== finalVal){
				return {"value":finalVal,"count":count};
			}else if(middleValue < finalVal){
				currentAry = ary.slice(middle,end+1);
			}else{
				currentAry = ary.slice(0,middle);
			}
			return computMiddle(currentAry,finalVal);
		}(ary,finalVal));
}
var tempAry =[1,5,7,8,9,11,22,55];
bisectionLgorithms(tempAry,5)  // Object {value: 5, count: 3}

```
## post与get请求的区别
1. 从语义上来说，`get`是拿数据，`post`是提交数据。
2. 从安全性上来说，`get`是将请求写在`URL`中，为明文，隐蔽性安全性低，而`post`数据放在请求体中进行传输，隐蔽性及安全性都高。
3. 从携带数据的体积上来说，`get`是写在URL中，虽然各个浏览器对URL长度的限度不统一，但均有限定（一般不要超过`IE`的最大长度`203`8个字符），但`post`是将数据放在请求体上的，所以理论上长度是没有限制的（但是服务器一般都限制了`POST`数据大小）。
4. 从请求次数来说，`get`请求是一次搞定，一个请求可以将数据拿到或者发送到，而`post`每个请求是发送两次，先发送请求头，再发送一次请求体，比`get`占用更多的带宽。

## [60fps 与设备刷新率](https://developers.google.com/web/fundamentals/performance/rendering/)

> 目前大多数设备的屏幕刷新率为 60 次/秒。因此，如果在页面中有一个动画或渐变效果，或者用户正在滚动页面，那么浏览器渲染动画或页面的每一帧的速率也需要跟设备屏幕的刷新率保持一致。
> 其中每个帧的预算时间仅比 16 毫秒多一点 (1 秒/ 60 = 16.66 毫秒)。但实际上，浏览器有整理工作要做，因此您的所有工作需要在 10 毫秒内完成。如果无法符合此预算，帧率将下降，并且内容会在屏幕上抖动。 此现象通常称为卡顿，会对用户体验产生负面影响。

## 像素管道
我们在工作时需要了解并注意五个主要区域。 这些是您拥有最大控制权的部分，也是像素至屏幕管道中的关键点：
<img src="../images/frame-full.jpg" style="max-width:100%;"/>
**JavaScript↓**。

> 一般来说，我们会使用 JavaScript 来实现一些视觉变化的效果。比如用 jQuery 的 animate 函数做一个动画、对一个数据集进行排序或者往页面里添加一些 DOM 元素等。当然，除了 JavaScript，还有其他一些常用方法也可以实现视觉变化效果，比如：CSS Animations、Transitions 和 Web Animation API。

**样式计算↓**。

> 此过程是根据匹配选择器（例如 .headline 或 .nav > .nav__item）计算出哪些元素应用哪些 CSS 规则的过程。从中知道规则之后，将应用规则并计算每个元素的最终样式。

**布局↓**。

> 在知道对一个元素应用哪些规则之后，浏览器即可开始计算它要占据的空间大小及其在屏幕的位置。网页的布局模式意味着一个元素可能影响其他元素，例如 <body> 元素的宽度一般会影响其子元素的宽度以及树中各处的节点，因此对于浏览器来说，布局过程是经常发生的。

**绘制↓**。

> 绘制是填充像素的过程。它涉及绘出文本、颜色、图像、边框和阴影，基本上包括元素的每个可视部分。绘制一般是在多个表面（通常称为层）上完成的

**合成↓**。

> 由于页面的各部分可能被绘制到多层，由此它们需要按正确顺序绘制到屏幕上，以便正确渲染页面。对于与另一元素重叠的元素来说，这点特别重要，因为一个错误可能使一个元素错误地出现在另一个元素的上层。

管道的每个部分都有机会产生卡顿，因此务必准确了解您的代码触发管道的哪些部分。

有时您可能听到与绘制一起使用的术语“栅格化”。这是因为绘制实际上分为两个任务： 1) 创建绘图调用的列表，以及 2) 填充像素。

后者称为“栅格化”，因此每当您在 DevTools 中看到绘制记录时，就应当将其视为包括栅格化。 （在某些架构下，绘图调用的列表创建以及栅格化是在不同的线程中完成，但是这不是开发者所能控制的。）

不一定每帧都总是会经过管道每个部分的处理。实际上，不管是使用 JavaScript、CSS 还是网络动画，在实现视觉变化时，管道针对指定帧的运行通常有三种方式：
1. **JS / CSS > 样式 > 布局 > 绘制 > 合成**。

<img src="../images/frame-full.jpg" style="max-width:100%;"/>

> 如果您修改元素的“layout”属性，也就是改变了元素的几何属性（例如宽度、高度、左侧或顶部位置等），那么浏览器将必须检查所有其他元素，然后“自动重排”页面。任何受影响的部分都需要重新绘制，而且最终绘制的元素需进行合成。

2. **JS / CSS > 样式 > 绘制 > 合成**。

<img src="../images/frame-no-layout.jpg" style="max-width:100%;"/>

> 如果您修改“paint only”属性（例如背景图片、文字颜色或阴影等），即不会影响页面布局的属性，则浏览器会跳过布局，但仍将执行绘制。

3. **JS / CSS > 样式 > 合成**。

<img src="../images/frame-no-layout-paint.jpg" style="max-width:100%;"/>

> 如果您更改一个既不要布局也不要绘制的属性，则浏览器将跳到只执行合成。

这个最后的版本开销最小，最适合于应用生命周期中的高压力点，例如动画或滚动。

性能是一种避免执行工作的艺术，并且使您执行的任何操作尽可能高效。 许多情况下，这需要与浏览器配合，而不是跟它对着干。 值得谨记的是，上面列出的各项管道工作在计算开销上有所不同；一些任务比其他任务的开销要大！

## script标签的async和defer属性记
一般情况下，html在渲染的时候一旦遇到`<script><link>`标签就会停止渲染，然后进行文件加载，文件加载返回结果之后才会继续渲染。现在说script标签的async和defer属性。
> async是异步加载，浏览器一遍加载文件，一遍继续渲染，文件加载完毕就会进行编译执行，从而继续阻塞浏览器页面渲染。
> defer 属性也是异步加载，与async不同的是，它在加载完成之后不会执行，只在页面渲染完毕，DOMContentLoaded之前执行。

<img src="../images/script-defer-async.jpg" style="max-width:100%;width: 100%;"/>

## css去除html结构中空白字符的方法
1. 对需要去除空白的节点父集添加`font-size:0`的样式，然后当前节点，在添加各自的`font-size:12px`将父节点样式冲突掉。
2. 对当前节点添加`margin-left:-4px`的样式，将空白字符抵消。
3. 删除节点之间的空白字符。
4. 使用注释（没用过）。

## JS变量类型
`Javascript`中的变量是无类型的，但是值却是有类型的，所以一个变量的可以对应不同的类型，可以理解为变量指向的地址变了，但是强类型语言中，变量再声明的时候就已经声明了其类型，其值只能是对应于该类型的。
