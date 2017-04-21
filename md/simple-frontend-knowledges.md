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
function fn(obj){
	!!obj.fn&&obj.fn()
}
fn({fn:function(){console.log(this)}}) 	//Object {}
```
↑ 通过上面测试可以得出，this指向的是该函数参数

```javascript
function fn(arg){
	!!arg&&arg()
}
fn({function(){console.log(this)}) 	//Window
```
↑ 通过上面测试可以得出，this指向的是Window
