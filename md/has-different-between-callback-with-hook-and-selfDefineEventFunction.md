# jquery的自定义事件以及VueJs、ReactJs的本质
## VueJs生命周期钩子
今天在回家的车上，闲来无事，突然想起来`VueJS`和`ReactJs`都有生命周期钩子，就想扒一扒它们之间的异同。
`VueJs`的生命周期钩子有这么几个：
1. beforeCreate
2. created
3. beforeMount
4. mounted
5. beforeUpdated
6. updated
7. beforeDestroy
8. destroyed

对这几个钩子，玩过`VueJs`的同胞们估计都烂熟于心了，而且官网也对这几个钩子都是在何时**触发**给了明确的图示。在此，我也贴一下官网的图示，网人云：‘无图无真相’...2333。

<img src="../images/vue-lifecycle.png" title="VueJs生命周期钩子" alt="VueJs生命周期钩子"  />

这样大家都知道，要想使用这几个钩子，就要保证在它生命的那一刻，其实例组件上有绑定这样一个方法存在，不然的话就不执行喽。

```javascript

function callHook (vm, hook) {
  var handlers = vm.$options[hook];
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      try {
        handlers[i].call(vm);
      } catch (e) {
        handleError(e, vm, (hook + " hook"));
      }
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
}

```
上面这个函数就是`VueJs`中调用`hook`函数的通用函数，而其在声明实例的时候便调用了一系列的`hook`函数，其调用方式为：

```javascript
// other init code
 callHook(vm, 'beforeCreate');
 // other init code
 callHook(vm, 'created');
// other code
```
这就是`VueJs`的钩子方法，联想一下再说`ReactJs`。

## ReactJs生命周期钩子
比它早一辈的`ReactJs`也有一个生命周期，它的生命周期也是面试官老生常谈的题目，虽然大家都知道有这么个事，但记不记住就是一回事啦，记得住的说明你基本功还挺扎实，面试官自然印象好，记不住的但说知道有这么一回事的，面试官只会觉得你知识面还可以。。。好了回家听通知吧2333。且在捋捋`ReactJS`的生命周期，走起：
1. componentWillMount
2. componentDidMount
3. componentWillReceiveProps
4. shouldComponentUpdate
5. componentWillUpdate
6. componentDidUpdate
7. componentWillUnmount

这几个生命周期，貌似除了没有组件卸载之后的调用，其它的`VueJs`都与之相差无几，都是在某个特定的时间点触发一个或者一组函数，估计`VuedJs`也有总结前人经验的地方吧，这说明这个设计很符合大众需求么。我没看过`ReactJs`的源码，但最近有个蛮火的开源框架`Preact`跟`react`很相似，而且比较精简，看一下对你的感悟会很深，其中有一段是调用`componentWillMount`和`componentWillReceiveProps`的代码：
```javascript
export function setComponentProps(component, props, opts, context, mountAll) {
	if (component._disable) return;
	component._disable = true;

	if ((component.__ref = props.ref)) delete props.ref;
	if ((component.__key = props.key)) delete props.key;

	if (!component.base || mountAll) {
		if (component.componentWillMount) component.componentWillMount();
	}
	else if (component.componentWillReceiveProps) {
		component.componentWillReceiveProps(props, context);
	}

	if (context && context!==component.context) {
		if (!component.prevContext) component.prevContext = component.context;
		component.context = context;
	}

	if (!component.prevProps) component.prevProps = component.props;
	component.props = props;

	component._disable = false;

	if (opts!==NO_RENDER) {
		if (opts===SYNC_RENDER || options.syncComponentUpdates!==false || !component.base) {
			renderComponent(component, SYNC_RENDER, mountAll);
		}
		else {
			enqueueRender(component);
		}
	}

	if (component.__ref) component.__ref(component);
}
```
可以清晰的看到，两个钩子是只要在特定的情况下才会触发的回调函数，以上就是对`ReactJs`钩子方法的看法，联想一下再说`jquery`。

## jQuery自定义事件
大名鼎鼎的`jQuery`，其当年威风，可以说没有任何框架可以与之媲美，当然`jQuery`只是一个`JS`库，这点一定要明白，很多前端攻城狮对它可以说又爱又恨，成也`jQuery`(降低了对原生`js`的依赖)，败也``jQuery``（因而脱离了`jQuery`就没办法干活啦！！有点跑题啦）,`jQuery`中有一个自定义事件，可以让你在你想进行操作的地方触发自定义事件，然后按照监听原生事件的写法，对其进行监听。一般的写法为：

```javascript
$('.someDom').trigger('anyEvent.action'); //触发自定义事件
$('.someDom').on('anyEvent.action',callback); //监听自定义事件
```
这就是自定义事件的写法,其实质也是在某个时间点触发一个或一组操作，联想一下再说`JS`的回调。

## js回调
`JS`的回调，为啥叫回调 就是想定义一个特定的时间，并在这个特定的时间，执行一个我们定义好的一个或者一组特定的方法。高大上的钩子也好，白富美的自定义事件也好，说白了就是指的回调函数。

**由于本人能力有限，文章仅供参考，如有错误，敬请指正**
