var stats;
var params = {
  snowfall: 10
};

window.addEventListener('load', init);
function init() {
  var frame = 5;
  var meshList = [];
  var renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#myCanvas'),
    alpha: true,
    antialias: true
  });
  renderer.setPixelRatio(1);
  renderer.setSize(window.innerWidth , window.innerHeight);
  renderer.setClearColor( 0x000000, 0 );

  var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight);
  camera.position.set(0, 0, -10);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  var scene = new THREE.Scene();
  scene.fog = new THREE.Fog( 0xffc71f, 0, 1500 );

  const light = new THREE.PointLight(0xfffbe3, 100, 1000, 1);
  light.position.set(0,500,0)
  scene.add(light);

  const meshFloor = new THREE.Mesh(
    new THREE.BoxGeometry(1000, 0.1, 1000),
    new THREE.MeshStandardMaterial( {
      color: 0x000000,
      opacity: 1,
      transparent: true
    } )
  );
  scene.add(meshFloor);
  meshFloor.position.set(0,0,200)
  meshFloor.rotation.x = - Math.PI / 2;


  stats = new Stats();
  document.body.appendChild( stats.dom );

  var gui = new dat.GUI();
  gui.add( params, 'snowfall', 0, 100 ).step( 1 );

  window.addEventListener( 'resize', function(){
    onWindowResize(camera, renderer);
  }, false );

  tick();
  function tick() {
    var mesh = new SnowFlakes();
    scene.add(mesh);
    meshList.push(mesh);
    for (var i = 0; i < meshList.length; i++) {
      meshList[i].update();
    }

    renderer.render(scene, camera);
    requestAnimationFrame(tick);

    frame++;
    if(frame % 2 == 0) { return; }

    stats.update();
  }
}

class SnowFlakes extends THREE.Object3D {
  constructor() {
    super();
    this.snowList = [];
    this.angle = 0;

    var length = params.snowfall; //雪の数

    var geometry = new THREE.BufferGeometry();

    var materials = [];

    var textureLoader = new THREE.TextureLoader();
    var sprite1 = textureLoader.load('https://dl.dropbox.com/s/13ec3ht27adnu1l/snowflake1.png?dl=0');
    var sprite2 = textureLoader.load('https://dl.dropbox.com/s/rczse8o8zt5mxe6/snowflake2.png?dl=0');
    var sprite3 = textureLoader.load('https://dl.dropbox.com/s/cs17pph4bu096k7/snowflake3.png?dl=0');
    var sprite4 = textureLoader.load('https://dl.dropbox.com/s/plwtcfvokuoz931/snowflake4.png?dl=0');
    var sprite5 = textureLoader.load('https://dl.dropbox.com/s/uhh77omqdwqo2z5/snowflake5.png?dl=0');

    var vertices = [];
    for ( var i = 0; i < length; i ++ ) {
      var x = getRandom(0, 500);
      var y = getRandom(0, 500);
      var z = getRandom(0, 500);
      vertices.push( x, y, z );
    }

    geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

    var parameters = [
      ["#FFFFFF", sprite2, getRandom(10, 10) ],
      ["#FFFFFF", sprite3, getRandom(10, 15) ],
      ["#FFFFFF", sprite1, getRandom(10, 15) ],
      ["#FFFFFF", sprite5, getRandom(5, 10) ],
      ["#FFFFFF", sprite4, getRandom(5, 10) ]
    ];

    for ( var i = 0; i < parameters.length; i ++ ) {
      var sprite = parameters[ i ][ 1 ];
      var size = parameters[ i ][ 2 ];
      materials[ i ] = new THREE.PointsMaterial({
        size: size,
        map: sprite,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true
      } );

      var particles = new THREE.Points( geometry, materials[ i ] );
      particles.rotation.x = Math.random() * 360;
      particles.rotation.y = Math.random() * 360;
      particles.rotation.z = Math.random() * 360;
      particles.vx = 0;
      particles.vy = 0;
      particles.material.opacity = 0;

      this.add(particles);
      this.snowList.push(particles);
    }
  }

  update() {
    this.angle += 0.001;

    for (var i = 0; i < this.snowList.length; i++) {
      this.snowList[i].material.opacity += 0.01;
      this.snowList[i].vy -= 1;
      this.snowList[i].vx = Math.sin(this.angle)*Math.cos(this.angle)*10;

      this.snowList[i].vx *= 0.2;
      this.snowList[i].vy *= 0.6;

      this.snowList[i].position.x += this.snowList[i].vx;
      this.snowList[i].position.y += this.snowList[i].vy;

      if (this.snowList[i].position.y < -1000) {
        this.snowList[i].material.opacity += 0.1;
        this.remove(this.snowList[i]);
        this.snowList.splice(i, 1);
        i -= 1;
        console.log(this.snowList.length);
      }
    }
  }
}



function onWindowResize(camera, renderer) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}


function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}
