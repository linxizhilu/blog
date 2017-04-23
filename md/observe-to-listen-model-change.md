# 观察者模式监听数据变化实现数据绑定

## 使用Object的getter和setter实现
```javascript
var obj = {},
	key = 'data',
	fn = function(value){
		console.log('hello '+value);
	},
	value = 'test';
Object.defineProperty(obj,key,{
	get:function(){
		fn(value);
		return value;
	},
	set:function(val){
		value = val;
	},
	configurable: false,
	enumerable:true
})
obj.data //hello test
"test"
```
## 使用es6的Proxy对象实现
Proxy的get方法对应于对象的取值，set方法对应于对象的赋值
```javascript
let fn = function(value){
		console.log('hello '+value);
	},
	value = 'test'
const target = Object.defineProperties({}, {
  foo: {
    value: 123,
    writable: true,
    configurable: false
  },
});

const handler = {
  get(target, propKey) {
  	fn(value);
    return value;
  }
};

const proxy = new Proxy(target, handler);

proxy.foo //hello test
"test"
```
## 编写一个方法，再函数内部实现对象赋值，同时触发函数
(本人猜想react内部原理有可能是这样实现的，暂未查看)
```javascript
let obj={},
	fn = function(value){
		console.log('hello '+value);
	},
	value = 'test'
const setValue = function(key,value){
	key = value;
	!!fn&&fn(value);
	return key;
};
setValue(obj.data,value) //hello test
"test"
```
