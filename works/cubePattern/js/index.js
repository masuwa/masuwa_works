window.addEventListener('load', init);
function init() {

    var scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0x24ceff, -5000, 5000 );

    //レンダラーを作成
    var renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#myCanvas'),
        antialias: true
    });
    //レンダラー
    renderer.setClearColor( 0x58c3e2 , 1 );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true; //影を入れる
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    //カメラ
    var camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -5000, 5000 );
    camera.position.set(30, 30, 30);
    camera.updateProjectionMatrix();
    camera.lookAt(scene.position);

    var cubeSize = 30;
    var cubeGeometry = new THREE.BoxGeometry( cubeSize, cubeSize, cubeSize );
  	var cubeMaterial = new THREE.MeshLambertMaterial({color : 0xffffff, shading: THREE.FlatShading});

    var range = 50;
    //立方体を作成
    for(var i = 0; i < 10000; i++){
        var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.castShadow = true;
        cube.receiveShadow = false;
        cube.position.x = getRandom(-1*range, range)*cubeSize;
        cube.position.y = getRandom(-1*range, range)*cubeSize;
        cube.position.z = getRandom(-1*range, range)*cubeSize;
        scene.add(cube);
    }

    //照明を作成
    var shadowlight = new THREE.DirectionalLight( 0xFFFFFF, 1);
  	shadowlight.castShadow = true;
    shadowlight.shadow.mapSize.width = 2048;
    shadowlight.shadow.mapSize.height = 2048;
    scene.add(shadowlight);
    var pointLight = new THREE.PointLight(0x0000FF, 100, 500, 1.0);
    scene.add(pointLight);
    var ambientLight = new THREE.AmbientLight( 0xFFFFFF, 1);
    scene.add(ambientLight);

    var GUI = new function() {
        this.bg_color = 16777215;
        this.cube_color = 16777215;
        //DirectionalLight
        this.d_color = shadowlight.color.getHex();
        this.d_intensity = shadowlight.intensity;
        this.d_x = 0;
        this.d_y = 200;
        this.d_z = 0;

        this.p_color = pointLight.color.getHex();
        this.p_intensity = pointLight.intensity;
        this.p_distance = pointLight.distance;
        this.p_x = 0;
        this.p_y = 200;
        this.p_z = 0;

        this.a_color = ambientLight.color.getHex();
        this.a_intensity = ambientLight.intensity;
    }

    var gui = new dat.GUI();

    gui.addColor(GUI, 'bg_color');
    gui.addColor(GUI, 'cube_color').onChange(function(val){
      cube.material.color.setHex(val);
    });

    // window.addEventListener( 'resize', function(){
    //   onWindowResize(camera, renderer);
    // }, false );

    var f1 = gui.addFolder('DirectionalLight')
    f1.addColor(GUI, 'd_color');
    f1.add(GUI, 'd_intensity', 0, 1);
    f1.add(GUI, 'd_x', -1000, 1000);
    f1.add(GUI, 'd_y', -1000, 1000);
    f1.add(GUI, 'd_z', -1000, 1000);

    var f2 = gui.addFolder('PointLightt')
    f2.addColor(GUI, 'p_color');
    f2.add(GUI, 'p_intensity', 0, 200);
    f2.add(GUI, 'p_distance', 0, 1000);
    f2.add(GUI, 'p_x', -1000, 1000);
    f2.add(GUI, 'p_y', -1000, 1000);
    f2.add(GUI, 'p_z', -1000, 1000);

    var f3 = gui.addFolder('ambientLight')
    f3.addColor(GUI, 'a_color');
    f3.add(GUI, 'a_intensity', 0, 1);

    f1.open();
    f2.open();
    f3.open();

    tick();

    function tick() {
      renderer.setClearColor( GUI.bg_color , 1 );

      shadowlight.color.setHex( GUI.d_color );
      shadowlight.intensity = GUI.d_intensity;
      shadowlight.position.set(GUI.d_x, GUI.d_y, GUI.d_z);

      pointLight.color.setHex( GUI.p_color );
      pointLight.intensity = GUI.p_intensity;
      pointLight.distance = GUI.p_distance;
      pointLight.position.set(GUI.p_x, GUI.p_y, GUI.p_z);

      ambientLight.color.setHex( GUI.a_color );
      ambientLight.intensity = GUI.a_intensity;

      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    }

    function getRandom(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    }

    // function onWindowResize(camera, renderer) {
    //   const width = window.innerWidth;
    //   const height = window.innerHeight;
    //   renderer.setPixelRatio(window.devicePixelRatio);
    //   renderer.setSize( window.innerWidth, window.innerHeight );
    //   camera.aspect = width / height;
    //   camera.updateProjectionMatrix();
    // }

}
