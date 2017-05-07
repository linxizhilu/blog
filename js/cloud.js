

require(['THREE','Detector'],function(THREE,Dectetor){
    var container;
    var camera, scene, renderer;
    var mesh, geometry, material,cube,cubAry=[],count=0,rain;

    var mouseX = 0, mouseY = 0;
    var start_time = Date.now();

    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;

    if(window.innerWidth>640 && Detector.webgl){
        init();
    }



    function init() {

        container = document.createElement( 'div' );
        container.id="cloud";
        document.body.appendChild( container );

        // Bg gradient

        var canvas = document.createElement( 'canvas' );
        canvas.width = 32;
        canvas.height = window.innerHeight;

        var context = canvas.getContext( '2d' );

        var gradient = context.createLinearGradient( 0, 0, 0, canvas.height );
        gradient.addColorStop(0, "#1e4877");
        gradient.addColorStop(0.5, "#4584b4");
        // gradient.addColorStop(0.5, "#b2b2aa");
        // gradient.addColorStop(0, "#000000");


        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        // container.style.background = 'url(' + canvas.toDataURL('image/png') + ')';
        // container.style.backgroundSize = '32px 100%';

        //创建相机

        camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 3000 );
        camera.position.z = 3000;
        // 创建场地
        scene = new THREE.Scene();
        // 加载器
        var loader = new THREE.TextureLoader();
        var cubeLoader = new THREE.CubeTextureLoader();
        // scene.background = loader.load( canvas.toDataURL('image/png') );
        scene.background = loader.load('images/san2.jpg');
      //   scene.background = cubeLoader.load(['images/tree2.jpg','images/tree1.jpg',
      // 'images/tree1.jpg','images/tree2.jpg','images/tree1.jpg','images/tree2.jpg']);
        // 创建图形
        geometry = new THREE.Geometry();
        // 创建纹理
        // var texture = THREE.ImageUtils.loadTexture( 'images/cloud.png', null, animate );
        var texture = loader.load('images/cloud.png', animate);
        texture.magFilter = THREE.LinearMipMapLinearFilter;
        texture.minFilter = THREE.LinearMipMapLinearFilter;

        // var fog = new THREE.Fog( 0x4584b4, - 100, 3000 );
        var fog = new THREE.Fog( 0x666666, - 100, 3000 );

        material = new THREE.ShaderMaterial( {
            uniforms: {
                "map": { type: "t", value: texture },
                "fogColor" : { type: "c", value: fog.color },
                "fogNear" : { type: "f", value: fog.near },
                "fogFar" : { type: "f", value: fog.far }
            },
            vertexShader: document.getElementById( 'vs' ).textContent,
            fragmentShader: document.getElementById( 'fs' ).textContent,
            depthWrite: false,
            depthTest: false,
            transparent: true

        } );

        // 创建一个正方形
        // var geometry1 = new THREE.BoxGeometry( 100, 100, 100 );
        // var material1 = new THREE.MeshBasicMaterial( {map: loader.load('images/linxizhilu.jpg')} );
        // cube = new THREE.Mesh( geometry1, material1 );
        // cube.rotation.y = 100;
        // cube.position.y = 220;
        // cube.position.x= -200;
        // scene.add( cube );


        // // 创建雨滴
        // rain =  new THREE.Mesh(new THREE.PlaneGeometry(100,50),new THREE.MeshBasicMaterial( {map: loader.load('images/rain2.jpg')} ));
        // // rain.position.z  = 1000;
        // scene.add( rain );

        var plane = new THREE.Mesh( new THREE.PlaneGeometry( 100,100) );

        for ( var i = 0; i < 8000; i++ ) {

            plane.position.x = Math.random() * 1000 - 500;
            plane.position.y = - Math.random() * Math.random() * 200 +15;
            // plane.position.y = 0;
            plane.position.z = i;
            plane.rotation.x = Math.random() * Math.PI;
            // plane.rotation.x = -Math.PI*22/50;
            plane.scale.x = plane.scale.y = Math.random() * Math.random() * 1.5 + 0.5;

            THREE.GeometryUtils.merge( geometry, plane );

        }

        mesh = new THREE.Mesh( geometry, material );
        scene.add( mesh );

        mesh = new THREE.Mesh( geometry, material );
        mesh.position.z = - 8000;
        scene.add( mesh );

        // 创建多个正方形;
        // let index=0,num = 8,tempCube;
        // for(;index<num;index++){
        //     tempMesh = new THREE.Mesh(new THREE.BoxGeometry(100,100,100),new THREE.MeshBasicMaterial({
        //         map:loader.load('images/showImg/'+index+'.jpg')
        //     }))
        //     tempMesh.position.z = -num*50;
        //     scene.add(tempMesh);
        //     cubAry.push(tempMesh);
        // }




        renderer = new THREE.WebGLRenderer( { antialias: false } );
        renderer.setSize( window.innerWidth, window.innerHeight );
        container.appendChild( renderer.domElement );

        document.addEventListener( 'mousemove', onDocumentMouseMove, false );
        window.addEventListener( 'resize', onWindowResize, false );


        // animate()
    }

    function onDocumentMouseMove( event ) {

        mouseX = ( event.clientX - windowHalfX ) * 0.25;
        mouseY = ( event.clientY - windowHalfY ) * 0.15;

    }

    function onWindowResize( event ) {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

    }

    function animate() {

        requestAnimationFrame( animate );

        position = ( ( Date.now() - start_time ) * 0.03 ) % 8000;

        camera.position.x += ( mouseX - camera.position.x ) * 0.01;
        camera.position.y += ( - mouseY - camera.position.y ) * 0.01;
        camera.position.z = - position + 8000;
        // cube.position.z = camera.position.z -1000;
        // rain.position.z = camera.position.z-10;
        // cube.rotation.y = mouseX*0.01;
        // cube.rotation.x = -mouseY*0.05;
        // if(!!cubAry){
        //     for(var num,i=0,len=cubAry.length;i<len;i++){
        //         cubAry[i].position.z = - position + 8000-800;
        //         if((num = i%2)){
        //             cubAry[i].position.x = -50*num;
        //             cubAry[i].position.y = 20;
        //         }else{
        //             cubAry[i].position.x = -100*num;
        //              cubAry[i].position.y = 150;
        //         }
        //         // cubAry[i].position.y=parseInt(i / len) * 550
        //     }
        // }

        // console.log(camera.position.z );
        renderer.render( scene, camera );

    }

})
