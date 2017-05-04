# VUE`初始化过程
## 通过断点查看VUE的初始化执行过程
1. 将`this`（`Vue$3`）赋值给`vm`
2. 给`vm`实例对象添加一个`id`，即`_uid++`
3. 给`vm`添加一个标识属性 `_isVue`,标识该对象是否应该被`observe`
4. 判断是否为组件实例，然后两种`options`结合方式。
5. `mergeOptions`用来合并两个`options`
6. 合并前，先对`props`进行初始化
7. 合并前，对`directives`指令进行初始化
8. 合并前，判断`options`里面是否有额外的配置参数，即`extends`的字段是否存在（如果是`function`则合并其`options`到目标对象，如何是对象则将其合并到目标对象）
9. 合并前，判断`options`里面是否有`mixins`字段，`mixins`是数组类型，如果`mixin`是`Vue$3`的实例，则将其`options`合并到目标对象，否则合并自身到目标对象
10. `options`合并，并以`options`里面的`key`为优先。
11. 合并完成后返回并将合并后的`options`对象赋值给`vm`的$`options`属性。
12. 初始化对象代理函数，即`Proxy`对象
13. 判断当前浏览器是否支持`Proxy`对象，即通过将该函数`toString()`后判断其是否存在`nativecode`字段等算法，支持即`hasProxy`标识字段为`true`
14. 如果`vm`的$`options`里面包含`render`属性，即将代理对象处理函数赋值为`get`方法，否则为`has`方法
15. 然后给`vm`添加方法`_renderProxy=new` `Proxy(vm`,`handlers)`,代理`vm`的`in`方法
16. 如果不含`proxy`方法，则直接将本身`vm`赋值到`vm._renderProxy`
17. 将`vm`自身赋值给`vm._self`
18. 初始化生命周期函数
19. 首先判断`vm.$options`是否有`parent`字段,如果有的话就将`vm`实例加入到`parent`的$`children`字段中，即2565行代码中的 `.push(vm)`
20. 如果不存在`parent`字段，初始化`vm.$parent`属性为`parent`（`undefined`）
21. 初始化`vm.$root`属性，如果`parent`不存在赋值为自身，否则赋值为`parent.$root`
22. 初始化`vm.$children`属性为数组[]
23. 初始化`vm.$refs`属性为空对象{}
24. 初始化`vm._watcher`为`null`
25. 初始化`vm._inactive=false`
26. 初始化`vm._isMounted` = `false`
27. 初始化`vm._isDestroyed=false`
28. 初始化`vm._isBeingDestroyed` = `false`
29. 生命周期函数初始化完毕
30. 初始化事件函数
31. 初始化`vm._event`为`Object.create(null)`
32. 初始化`vm._hasHookEvent`为`false`
33. 初始化父对象中的事件句柄，如果`vm.options._parentListeners`存在的话
34. 事件函数初始化完毕
35. 初始化渲染函数(即`render)`
36. 初始化`vm.$vnode=null(the` `placeholder` `node` `in` `parent` `tree)`
37. 初始化`vm._vnode=null(the` `root` `of` `the` `child` `tree)`
38. 初始化`vm._staticTrees=null`
39. 初始化`vm.$slots`为`optins`中的`_renderChildren`，不存在的话默认为{}
40. 初始化`vm.$scopedSlots`为空对象{}
41. 初始化`vm._c`为`node`节点的生成构建函数即（`createElement`）（内部使用）
42. 初始化`vm.$createElement`为`node`节点的生成构建函数即（`createElement`）（外部调用）
43. 渲染函数初始化完毕
44. 触发生命周期函数，`beforeCreate`节点，如果`options`里面监听了`beforeCreate`的生命周期方法，即触发该函数，同时如果`vm._hasHookEvent`为`true`时，触发`vm.$emit`方法
45. 初始化`state`函数
46. 初始化`vm._watchers=`[]
