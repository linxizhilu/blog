
(function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            if(clientWidth>=640){
                docEl.style.fontSize = '25px';
            }else{
                docEl.style.fontSize = 25 * (clientWidth / 640) + 'px';
            }
        };

    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
(function(){
  var ary = ['forEach','map','push']
    ary.forEach((item,i)=>{
      window[item+'_native'] = ary[item];
    })
    document.querySelector('#content').style.minHeight = window.innerHeight+'px';
  var sidebarDom = document.querySelector('#sidebar'),
      contentDom = document.querySelector('#detail'),
      backTopDom = document.querySelector('#backTop');
  getData({url:'readme.md',
  		data:'',
  		key:'',
  		fn:function(data){
  			sidebarDom.innerHTML = marked(data)
  			var navDoms = sidebarDom.querySelectorAll('h5 a');
  			forEach_native.call(navDoms,(dom,i)=>{
            if(dom.href.indexOf('github.com')!=-1)return;
  					dom.href = 'javascript:;'
  					dom.addEventListener('click',function(){
  					var self = this,
  						title = self.title;
  						history.pushState({t:title},'','index.html?t='+title);
  						updateContent();
  					})
  				})
  			}
  		})
  function getPage(){
  	return location.search.split('=')[1] || 'symbol';
  }
  updateContent();
  function updateContent(){
  	var key = getPage();
  	getData({
  			url:'md/'+key+'.md',
  			key:key,
  			data:'',
  			fn:function(data){
          var classList = contentDom.classList;
          classList.add('bounceOutDown');
          contentDom.addEventListener('webkitAnimationEnd',out)
          function out(){
            console.time();
            updateContet(data);
            window.scrollTo(0,0)
            console.timeEnd();
            contentDom.removeEventListener('webkitAnimationEnd',out);
            classList.remove('bounceOutDown');
            classList.add('bounceInUp');
          }
  			}

  		})
  }
  // 更新内容
  function updateContet(data){
      contentDom.innerHTML = marked(data);
      // 完成代码高亮
      forEach_native.call(document.querySelectorAll('code'),function(dom,i) {
        Prism.highlightElement(dom);
      });
      updateSrc(contentDom);
      updateTitelId(contentDom);
  }
  // 修改contentdom下面img的路径
  function updateSrc(dom) {
    var imgDoms = dom.querySelectorAll('img');
    imgDoms.length>0 && forEach_native.call(imgDoms,(dom,i)=>{
      var src = dom.getAttribute('src');
      dom.setAttribute('src',src.substring(3));
    })
  }
  function updateTitelId(dom){
    var h2Doms = dom.querySelectorAll('h2'),html='<ul>';

    h2Doms.length>0 && forEach_native.call(h2Doms,function(item,i){
      item.id = 'title' + i;
      html += '<li><a href="javaScript:;" data-href="#'+item.id+'">'+ item.innerText +'</a></li>';
    })
    html += '</ul>';
    var div = document.createElement('div');
    div.id = "titleNav";
    div.innerHTML = html;
    contentDom.querySelector('h1').insertAdjacentElement('afterend',div);
    forEach_native.call(contentDom.querySelectorAll('#titleNav li a'),(navDom,index)=>{
      navDom.addEventListener('click',function(e){
        var self = this,
            href = self.dataset.href;
            moveToMiddle(href, 0, '', 'top')

      })
    })
  }
  window.onpopstate = function(event) {
  	updateContent();
  };
  backTopDom.addEventListener('click',function(){
    moveToMiddle('#detail',0);
  })

  function getData(arg){
    var key = arg.key,
    store = window.sessionStorage,
    data;
    // if(!!key && !!(data = store.getItem(key))){
    // 	arg.fn && arg.fn(data);
    // 	return;
    // }
    window.fetch(arg.url).then(data=>data.text()).then(data=>{arg.fn&&arg.fn(data),store.setItem(key,data)}).catch(err=>console.log(`error:${err}`));
  }
  // 将一个dom移动到页面中间或者上方
  function moveToMiddle(elem, height, fn, pos) {
    var pos = pos || 'middle',
    winWidth = window.innerWidth,
    winHeight = window.innerHeight,
    height = parseInt(height) || 0,
    btnCurOftTop = document.querySelector(elem).getBoundingClientRect().top,
    headerHeight = 0,
    posObj = {},
    curScrollTop = document.documentElement.scrollTop,
    diffTop;
    posObj.middle = (winHeight - headerHeight - height) / 2 + headerHeight;
    posObj.top = headerHeight;
    if (height > winHeight - headerHeight) {
      pos = 'top';
    }
    diffTop = btnCurOftTop - posObj[pos];
    setTimeout(function() {
      animate1(diffTop, fn);
    }, 200)
  }
  var animationFrame =  (function(window){
    return window.requestAnimationFrame ||    //IE10以及以上版本，以及最新谷歌，火狐版本
    window.webkitRequestAnimationFrame ||   //谷歌老版本
    window.mozRequestAnimationFrame ||   //火狐老版本
    function(callback){    //IE9以及以下版本
      window.setTimeout(callback , 1000/60);  //这里强制让动画一秒刷新60次，这里之所以设置为16.7毫秒刷新一次，是因为requestAnimationFrame默认也是16.7毫秒刷新一次。
    }
  })(window);
  // 运动函数
  function animate1(diff, fn, step) {
    var diff = diff || 0,
    step = step || 3,
    tempStep = step,
    num = 10,
    flag = diff > 0 ? true : false,
    $win = document.body,
    curScrollTop,
    count = 0,
    lastScrollTop;
    (function move() {
      curScrollTop = $win.scrollTop;
      if (curScrollTop === lastScrollTop) {
        !!fn && fn();
        return;
      }
      count++;
      if(count > 1000){
        return;
        console.log('error');
      };
      lastScrollTop = curScrollTop;
      if (flag) {
        if (diff > num / 2) {
          tempStep = -diff / num;
          diff += tempStep;
          animationFrame(move);
        } else {
          tempStep = diff;
          diff -= tempStep;
          !!fn && fn();
        }

      } else {
        if (diff < -num / 2) {
          tempStep = -diff / num;
          diff += tempStep;
          $win.scrollTop = curScrollTop - tempStep;
          animationFrame(move);
        } else {
          tempStep = -diff;
          diff += tempStep;
          !!fn && fn();
        }
      }
      $win.scrollTop = curScrollTop - tempStep;
    })()
  }
})()
