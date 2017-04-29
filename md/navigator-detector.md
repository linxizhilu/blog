# 常用浏览器嗅探代码
浏览器嗅探技术对于一个前端是多么需要的技术。只有身在其中才能明白其中苦，下面是各大神常用方法:
## IE嗅探
```javascript
ie=!!window.VBArray
ie678=!+"\v1";
ie678=!-[1,];
ie678='\v'=='v';
ie678=('a-b'.split(/(~)/))[1]=="b"
ie678=0.9.toFixed(0)=="0"
ie678=/\w/.test('\u0130')
ie8=window.toStaticHTML
ie9=window.msPerformance
ie678=0//@cc_on+1;
ie67=!"1"[0]
ie8=!!window.XDomainRequest;
ie9=document.documentMode&&document.documentMode===9;
ie10 = window.navigator.msPointerEnabled;
ie11 = !!window.MSInputMethodContext;
```
## FireFox
```javascript
firefox=!!window.netscape || !!window.updateCommands;
```
## safari
```javascript
safari=window.openDatabase&&!window.chrome;
```
## chorme
```javascript
chrome=!!(window.chrome);
```

## 移动设备篇
```javascript
iphone=/iphone/i.test(navigator.userAgent);
iphone4=window.devicePixelRatio>=2;
ipad=/iPad/i.test(navigator.userAgent);
Android=/android/i.test(navigator.userAgent);
iOS=iphone||ipad;
```
