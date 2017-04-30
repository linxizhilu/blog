function rotateImg(){
    var win_h = window.innerHeight,
        win_w = window.innerWidth,
        row = 4,
        initalRow = row;
        imgHeight = parseInt(win_h/row);
        imgWidth = imgHeight,
        lastNum = parseInt(win_w/imgWidth),
        padding = (win_w - lastNum*imgWidth)/2,
        clumn = lastNum,
        i=0,
        ul= document.getElementById('ul'),
        li = null,
        liAry = [];
        ul.style.padding ='0 '+padding+'px';
        for(i;i < row;i++){
            if(i%2==0){
                ul.innerHTML +='<li style="text-align:left;overflow:hidden;height:'+imgHeight+'px"></li>';
            }else{
                ul.innerHTML += '<li dir="rtl"  style="text-align:right;overflow:hidden;height:'+imgHeight+'px"></li>'
            }
        };
        var timer = window.setInterval(function(){
            if(row > 0){
                li = ul.children[initalRow-row];
                if(liAry.length===0 || (liAry.length>0 && (liAry[liAry.length-1] != li))){
                    liAry.push(li);
                }
                if(clumn>0){
                    var num = (initalRow+1)*lastNum + 1 - (clumn + row*lastNum);
                    createImg('images/showImg/'+num+'.jpg',function(img){
                        var imgCloneAry = [],imgClone,childrenDoms=null,childrenDom=null;
                        for(var j=0,length = liAry.length;j<length;j++){
                            if(j>0){
                                var len = liAry[0].children.length;
                                childrenDom = liAry[0].children[parseInt((j)*lastNum)].cloneNode(true);
                                childrenDom.style.width = childrenDom.style.height = 0;
                                childrenDom.style.opacity = '0.2';
                                childrenDom.style.transform = "rotateZ(0deg)";
                                handleImg(childrenDom);
                            }else{
                                imgClone = img.cloneNode(true);
                                handleImg(imgClone);
                            }
                            function handleImg(imgClone){
                                if(!liAry[j].children){
                                    liAry[j].appendChild(imgClone);
                                }else{
                                    liAry[j].insertBefore(imgClone,liAry[j].firstChild);
                                }
                                setValue(imgClone);
                            }
                            function setValue(imgClone){
                                setTimeout(function(){
                                    if('transition' in document.documentElement.style){
                                        imgClone.style.width = imgWidth+'px';
                                        imgClone.style.height = imgHeight+'px';
                                        imgClone.style.opacity = 1;
                                        imgClone.style.transform = "rotateZ(-720deg)";
                                    }else{
                                        $(imgClone).animate({
                                            'width':imgWidth,
                                            'height':imgHeight,
                                            opacity :1
                                        })
                                    }
                                },50);
                            }
                        }
                    });
                    clumn--;
                }else{
                    clumn = lastNum;
                    row --;
                }
            }else{
                clearInterval(timer);
            }
        },100)
    function createImg(src,fn){
        var img = document.createElement('img');
        img.src = src;
        img.style.width = 0;
        img.style.height = 0;
        img.style.webkitTransition =' all 1s';
        img.style.msTransition =' all 1s';
        img.style.transition =' all 1s';
        img.style.transition =' all 1s';
        img.style.verticalAlign = 'middle';
        img.style.marginBottom="30px";
        img.style.opacity="0.2";
        img.style.transform="rotateZ(720deg)";
        img.onload=function(){
            fn(img);
        }
    }
}
