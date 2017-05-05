
require(['marked','prism','pubu','utils'],function(marked,prism,pubu,utils){

      var ary = ['forEach','map','push']
          ary.forEach((item,i)=>{
            window[item+'_native'] = ary[item];
          }),
          publicNet = (location.hostname === 'linxizhilu.com');
          document.querySelector('#content').style.minHeight = window.innerHeight+'px',
          sidebarDom = document.querySelector('#sidebar'),
          contentDom = document.querySelector('#detail'),
          backTopDom = document.querySelector('#backTop'),
          utils = utils || {},
          preFix = utils.firefox ? 'moz':'webkit';
      getData({url:'readme.md',
          		data:'',
          		key:''})
      .then((data)=>{
        sidebarDom.innerHTML = marked(data)
        var navDoms = sidebarDom.querySelectorAll('ul a'),
            h3Doms = sidebarDom.querySelector('h3'),
            bodyDom = document.querySelector('body'),
            ulDom = sidebarDom.querySelector('ul'),
            logoDom = sidebarDom.querySelector('img');
        navAction(navDoms);
        utils.addEvent(h3Doms,'click',function(){
          if(window.innerWidth<640){
            ulDom.style.left = 0;
            // bodyDom.classList.add('hidden');
            contentDom.classList.add('blur');
          }

        })
        utils.addEvent(ulDom,'click',function(){
          if(window.innerWidth<640){
            ulDom.style.left = '1000px';
            // bodyDom.classList.remove('hidden');
            contentDom.classList.remove('blur');
          }
        })
        utils.addEvent(logoDom,'click',function(){
          if(window.innerWidth > 640){
            history.pushState({},'','index.html');
            contentDom.classList.add('bounceOutDown');
            contentDom.addEventListener(preFix+'AnimationEnd',function(){
              if(!getPage()){
                contentDom.innerHTML = '';
                pubu(navDoms.length);
                navAction(document.querySelectorAll('#ul a'));
                document.querySelector('#ul').style.opacity=1;
              }
            });
          }
        })
        if(!getPage()){
          pubu(navDoms.length);
          navAction(document.querySelectorAll('#ul a'));
        }else{
          updateContent();
        }
      })
      .catch(err=>console.error(err));

      // 添加导航跳转操作
      function navAction(doms){
        forEach_native.call(doms,(dom,i)=>{
          if(dom.href.indexOf('github.com')!=-1)return;
          dom.href = 'javascript:;'
          dom.addEventListener('click',function(){
          var self = this,
            title = self.title;
            history.pushState({t:title},'','index.html?t='+title);
            updateContent();
            document.querySelector('#ul').style.opacity=0;
          })
        })
      }
      // 获取当前的query值
      function getPage(){
      	return location.search.split('=')[1] || (window.innerWidth > 640 ? '':'symbol');
      }

      // 更新当前的文档信息，拿取数据
      function updateContent(){
      	var key = getPage();
        if(!key){return};
      	getData({
      			url:'md/'+key+'.md',
      			key:key,
      			data:''
    		})
        .then((data)=>{
          // console.log(data);
          var classList = contentDom.classList,
              flag = true,
              timer;
          classList.add('bounceOutDown');
          timer = setTimeout(function(){
            out();
          },500)
          contentDom.addEventListener(preFix+'AnimationEnd',out)
          function out(){
            if(!flag)return;
            flag = false;
            clearTimeout(timer);
            console.time();
            updateDetail(data);
            if(window.innerWidth >640){
              window.scrollTo(0,0);
            }
            console.timeEnd();
            contentDom.removeEventListener(preFix+'AnimationEnd',out);
            classList.remove('bounceOutDown');
            classList.add('bounceInUp');
          }
        })
        .catch(err=>console.error(err))
      }

      // 更新内容数据
      function updateDetail(data){
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
      // 修改文档内的h2标签ID，用来做锚点
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
        var h1Dom = contentDom.querySelector('h1');
        if(h1Dom.inserAdjacentElement){
          h1Dom.insertAdjacentElement('afterend',div);
        }else{
          contentDom.insertBefore(div,h1Dom.nextSibling);
        }
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
      // 添加回到顶部操作
      backTopDom.addEventListener('click',function(){
        moveToMiddle('#detail',0);
      })
      // 获取数据公用方法
      function getData(arg){
        return  new Promise((resolve,reject)=>{
          var ary = arg,
          key = arg.key,
          store = window.sessionStorage,
          data;
          if(publicNet && !!key && !!(data = store.getItem(key))){
          	// arg.fn && arg.fn(data);
            resolve(data);
          	return;
          }
          window.fetch(arg.url,{
            mode:'no-cors'
          })
          .then(data=>data.text())
          .then(data=>{
            store.setItem(key,data)
            resolve(data);
            // !!arg.fn&&arg.fn(data),
            })
          .catch(err=>{
            console.log(`error:${err}`)
            reject(err);
          });

        })

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
          tempAnimate(diffTop, fn);
        }, 200)
        function tempAnimate(diff, fn, step) {
          var diff = diff || 0,
          step = step || 3,
          tempStep = step,
          num = 10,
          flag = diff > 0 ? true : false,
          $win = utils.firefox ? document.documentElement : document.body ,
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
              console.log('error');
              return;
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

    // })()
})
