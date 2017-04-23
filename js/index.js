
// (function (doc, win) {
//     var docEl = doc.documentElement,
//         resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
//         recalc = function () {
//             var clientWidth = docEl.clientWidth;
//             if (!clientWidth) return;
//             if(clientWidth>=640){
//                 docEl.style.fontSize = '20px';
//             }else{
//                 docEl.style.fontSize = 20 * (clientWidth / 640) + 'px';
//             }
//         };
//
//     if (!doc.addEventListener) return;
//     win.addEventListener(resizeEvt, recalc, false);
//     doc.addEventListener('DOMContentLoaded', recalc, false);
// })(document, window);
(function(){
  var ary = ['forEach','map','push']
    ary.forEach((item,i)=>{
      window[item+'_native'] = ary[item];
    })
  var sidebarDom = document.querySelector('#sidebar');
  getData({url:'readme.md',
  		data:'',
  		key:'',
  		fn:function(data){
  			sidebarDom.innerHTML = marked(data)
  			var navDoms = sidebarDom.querySelectorAll('h5 a');
  			forEach_native.call(navDoms,(dom,i)=>{
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
  var contentDom = document.querySelector('#content');
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
            updateContet(data);
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
  }
  // 修改contentdom下面img的路径
  function updateSrc(dom) {
    var imgDoms = dom.querySelectorAll('img');
    imgDoms.length>0 && forEach_native.call(imgDoms,(dom,i)=>{
      var src = dom.getAttribute('src');
      dom.setAttribute('src',src.substring(3));
    })
  }

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

  window.onpopstate = function(event) {
  	updateContent();
  };
})()
