function pubu(num) {
  createPhoto(num);
  setPos();
  utils.addEvent(window, 'resize', resize);

  function resize() {
    var $imgDoms = document.querySelectorAll('.img'),
      winWidth;
    var win_w = (winWidth = window.innerWidth) < 640 ? winWidth : (winWidth - 400),
      signalWidth = parseInt($imgDoms[0].offsetWidth) * 3 / 2,
      num = parseInt(win_w / signalWidth),
      flag = 0,
      prevNum, curNum;
    ([]).forEach.call($imgDoms, function(dom, index) {
      dom.style.left = index % num * 300 + (parseInt(index / num) % 2) * 150 + 'px';
      dom.style.top = parseInt(index / num) * 150 + 'px';
    })
  }

  function setPos(dom, left, top) {
    var $imgDoms = document.querySelectorAll('.img'),
      winWidth;
    var win_w = (winWidth = window.innerWidth) < 640 ? winWidth : (winWidth - 400),
      signalWidth = parseInt($imgDoms[0].offsetWidth) * 3 / 2,
      num = parseInt(win_w / signalWidth),
      flag = 0,
      prevNum, curNum,
      length = $imgDoms.length;
    ([]).forEach.call($imgDoms, function(dom, index) {
      setTimeout(function() {
        dom.style.left = index % num * 300 + (parseInt(index / num) % 2) * 150 + 'px';
        dom.style.top = parseInt(index / num) * 150 + 'px';
      }, (length - index) * 100);
    })
  }

  function createPhoto(num) {
    var html = [],
      text, title, navDoms = document.querySelectorAll('#sidebar ul a'),
      total = 32,
      page, tempAry = [],
      ulDom = document.getElementById('ul'),
      liDoms;
    while (num-- > 0) {
      text = navDoms[num].innerText;
      title = navDoms[num].title;
      page = getPage();
      html.push('<li class="img"><a href="javascript:;" title="' + title + '" class="wrap"><img src="images/showImg/' + page + '.jpg" alt="" class="responsive"><div class="navInfo">' + text + '</div></a></li>')
    }
    ulDom.innerHTML = html.join('');
    liDoms = ulDom.querySelectorAll('.img');
    ([]).forEach.call(liDoms,(dom,index)=>{
      num = Math.random()*0.5+0.5;
      dom.style.transform = 'rotateZ(-45deg) scale('+ num +')';
    })
    // console.log(liDoms);
    // ([]).forEach.call(liDoms,(dom,index)=>{
    //   utils.addEvent(dom,'mouseenter',function(){
    //     var self = this,
    //     navInfoDoms;
    //     navInfoDoms = utils.queryDom('.navInfo',self);
    //     navInfoDoms.style.top = 0;
    //     navInfoDoms.style.opacity = 1;
    //     navInfoDoms.style.transition = 'all 0.5s ease 0s';
    //   })
    //   utils.addEvent(dom,'mouseleave',function(e){
    //       console.log(e);
    //     var pageX = e.pageX || e.clientX,
    //         pageY = e.pageY || e.clientY;
    //   })
    // })

    function getPage() {
      var temPpage = parseInt(Math.random() * 32);
      if (tempAry.indexOf(temPpage) != -1) {
        temPpage = getPage();
      } else {
        tempAry.push(temPpage);
      }
      return temPpage;
    }
  }
}
