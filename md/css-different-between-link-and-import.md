# css: link、@import的不同

css和@import都是调用外部样式表的方法。

### 一、用法
####.	link:
>html中添加：
```javascript
<link rel="stylesheet" type="text/css" href="css文件路径"/>
```

####. @import

>html中添加：
```javascript
<style type="text/css">
	@import url(css文件路径);
</style>
```

>css中添加：
```css
@import url(css文件路径);
```

### 二、区别
1. `link`是`html`标签，不存在兼容性问题，`@import`是`css2.1`提出的，低版本浏览器不支持。

2. `link`是引用样式，是和页面加载同步进行加载的，`@import`是等页面加载完成后才开始加载。

3. `link`支持`js`进行样式控制，而`@import`不支持。

