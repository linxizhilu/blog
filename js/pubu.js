function pubu(num){
  createPhoto(num);
  setPos();
  utils.addEvent(window,'resize',resize);
  function resize(){
    var $imgDoms = document.querySelectorAll('.img');
    var win_w = window.innerWidth-400,
    signalWidth = parseInt($imgDoms[0].offsetWidth)*3/2,
    num = parseInt(win_w/signalWidth),
    flag = 0,prevNum,curNum;
    ([]).forEach.call($imgDoms,function(dom,index){
      dom.style.left= index%num*300+(parseInt(index/num)%2)*150+'px';
      dom.style.top = parseInt(index/num)*150+'px';
    })
  }
  function setPos(dom,left,top){
    var $imgDoms = document.querySelectorAll('.img');
    var win_w = window.innerWidth-330,
    signalWidth = parseInt($imgDoms[0].offsetWidth)*3/2,
    num = parseInt(win_w/signalWidth),
    flag = 0,prevNum,curNum,
    length = $imgDoms.length;
    ([]).forEach.call($imgDoms,function(dom,index){
      setTimeout(function () {
        dom.style.left= index%num*300+(parseInt(index/num)%2)*150+'px';
        dom.style.top = parseInt(index/num)*150+'px';
      }, (length-index)*100);
    })
  }
  function createPhoto(num){
    var html = [],text,title,navDoms = document.querySelectorAll('#sidebar ul a');
    while(num-- > 0 ){
      text = navDoms[num].innerText;
      title = navDoms[num].title;
      html.push('<li class="img"><a href="javascript:;" title="'+ title +'" class="wrap"><img src="images/showImg/'+num+'.jpg" alt="" class="responsive"><div class="navInfo">'+text+'</div></a></li>')
    }
    document.getElementById('ul').innerHTML = html.join('');
  }
}
