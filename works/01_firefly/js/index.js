var controls;
var text;
var material;
var container, stats;
var camera, scene, renderer, particle;
var mouseX = 0, mouseY = 0;
var pageX = 0, pageY = 0;
var controls, gui;
var tween;
var tw = TWEEN.Easing.Elastic.Out;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();


function init() {
    //出力
    container = document.createElement( 'div' );
    document.body.appendChild( container );
    //カメラ
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 5000 );
    camera.position.z = 1000;
    //シーンの作成
    scene = new THREE.Scene();

    renderer = new THREE.CanvasRenderer();
    // 描画する色・比率・サイズの初期化
    renderer.setClearColor( 0x000020 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );
    //stats.js
    stats = new Stats();
    container.appendChild( stats.dom );
    //マウスが動いたらonDocumentMouseMove()発火
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    //タッチして動かしたら発火
    document.addEventListener( 'touchmove', onDocumentTouchMove, false );
    //リサイズしたらonWindowResize()発火
    window.addEventListener( 'resize', onWindowResize, false );

    controls = new function () {
        this.num = "Quadratic.In";
    };

    //tweenのイージング
    var tweens = [
        'Linear.None',
        'Quadratic.In',
        'Quadratic.Out',
        'Cubic.In',
        'Cubic.Out',
        'Cubic.InOut',
        'Quartic.In',
        'Quartic.Out',
        'Quartic.InOut',
        'Quintic.In',
        'Quintic.Out',
        'Quintic.InOut',
        'Sinusoidal.In',
        'Sinusoidal.Out',
        'Sinusoidal.InOut',
        'Exponential.In',
        'Exponential.Out',
        'Exponential.InOut',
        'Circular.In',
        'Circular.Out',
        'Circular.InOut',
        'Elastic.In',
        'Elastic.Out',
        'Elastic.InOut',
        'Back.In',
        'Back.Out',
        'Back.InOut',
        'Bounce.In',
        'Bounce.Out',
        'Bounce.InOut'
    ];

    gui = new dat.GUI();
    //tween.easingの切り替え
    gui.add(controls, 'num',tweens).onChange(function(e){
        switch (e) {
            case "Linear.None":
                tw = TWEEN.Easing.Linear.None;
                break;
            case "Quadratic.In":
                tw = TWEEN.Easing.Quadratic.In;
                break;
            case "Quadratic.Out":
                tw = TWEEN.Easing.Quadratic.Out;
                break;
            case "Cubic.In":
                tw = TWEEN.Easing.Cubic.In;
                break;
            case "Cubic.Out":
                tw = TWEEN.Easing.Cubic.Out;
                break;
            case "Cubic.InOut":
                tw = TWEEN.Easing.Cubic.InOut;
                break;
            case "Quartic.In":
                tw = TWEEN.Easing.Quartic.In;
                break;
            case "Quartic.Out":
                tw = TWEEN.Easing.Quartic.Out;
                break;
            case "Quartic.InOut":
                tw = TWEEN.Easing.Quartic.InOut;
                break;
            case "Quintic.In":
                tw = TWEEN.Easing.Quintic.In;
                break;
            case "Quintic.Out":
                tw = TWEEN.Easing.Quintic.Out;
                break;
            case "Quintic.InOut":
                tw = TWEEN.Easing.Quintic.InOut;
                break;
            case "Sinusoidal.In":
                tw = TWEEN.Easing.Sinusoidal.In;
                break;
            case "Sinusoidal.Out":
                tw = TWEEN.Easing.Sinusoidal.Out;
                break;
            case "Sinusoidal.InOut":
                tw = TWEEN.Easing.Sinusoidal.InOut;
                break;
            case "Exponential.In":
                tw = TWEEN.Easing.Exponential.In;
                break;
            case "Exponential.Out":
                tw = TWEEN.Easing.Exponential.Out;
                break;
            case "Exponential.InOut":
                tw = TWEEN.Easing.Exponential.InOut;
                break;
            case "Circular.In":
                tw = TWEEN.Easing.Circular.In;
                break;
            case "Circular.Out":
                tw = TWEEN.Easing.Circular.Out;
                break;
            case "Circular.InOut":
                tw = TWEEN.Easing.Circular.InOut;
                break;
            case "Elastic.In":
                tw = TWEEN.Easing.Elastic.In;
                break;
            case "Elastic.Out":
                tw = TWEEN.Easing.Elastic.Out;
                break;
            case "Elastic.InOut":
                tw = TWEEN.Easing.Elastic.InOut;
                break;
            case "Back.In":
                tw = TWEEN.Easing.Back.In;
                break;
            case "Back.Out":
                tw = TWEEN.Easing.Back.Out;
                break;
            case "Back.InOut":
                tw = TWEEN.Easing.Back.InOut;
                break;
            case "Bounce.In":
                tw = TWEEN.Easing.Bounce.In;
                break;
            case "Bounce.Out":
                tw = TWEEN.Easing.Bounce.Out;
                break;
            case "Bounce.InOut":
                tw = TWEEN.Easing.Bounce.InOut;
                break;
        }
    });
}

//画面の幅が変わっても比率を直す
function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

//光分子の作成
function generateSprite() {
    var canvas = document.createElement( 'canvas' );
    canvas.width = 50;
    canvas.height = 50;
    var context = canvas.getContext( '2d' );
    var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
    gradient.addColorStop( 0, 'rgba(203,245,72,0.8)' );
    gradient.addColorStop( 0.3, 'rgba(173,239,42,0.8)' );
    gradient.addColorStop( 0.6, 'rgba(109,233,47,0.8)' );
    gradient.addColorStop( 0.8, 'rgba(20,25,4,0.8)' );
    gradient.addColorStop( 1, 'rgba(0,0,0,0.8)' );
    context.fillStyle = gradient;
    context.fillRect( 0, 0, canvas.width, canvas.height );
    return canvas;
}



class Particle extends THREE.Sprite {
  /** コンストラクターです。 */
  constructor(size) {
    const material = new THREE.SpriteMaterial( {
        map: new THREE.CanvasTexture( generateSprite() ),
        blending: THREE.AdditiveBlending
    } );
    super(material);

    this.position.set( mouseX, mouseY, -1000 );
    this.scale.x = this.scale.y =　Math.random() * Math.random() * size;

    tween = new TWEEN.Tween( this.position )
    tween.delay( 0 )
    .to( {
        x: Math.random() * 4000 - 2000,
        y: Math.random() * 1000 - 500,
        z: Math.random() * 4000 - 2000
    }, 10000)
    .start();
    tween.easing(tw);

    //パーティクルの大きさの変化
    new TWEEN.Tween( this.scale )
    .delay( 0 )
    .to( { x: 0.01, y: 0.01 }, 5000 )
    .start();
  }
  update() {
  }
}


//マウスが動いたら
function onDocumentMouseMove( event ) {
    //画面の移動
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
    for(var i = 0; i < 2; i++){
      particle = new Particle(windowHalfX);
      scene.add( particle );
    }
}

//指が動いたら
function onDocumentTouchMove( event ) {
    event.preventDefault();
    //画面の移動
    mouseX = event.changedTouches[0].pageX - windowHalfX;
    mouseY = event.changedTouches[0].pageY - windowHalfY;

    for(var i = 0; i < 2; i++){
      particle = new Particle(windowHalfX*2);
      scene.add( particle );
    }
}

function animate() {
    requestAnimationFrame( animate );
    render();
    stats.update();
}

function render() {
    TWEEN.update();
    camera.position.x += ( mouseX - camera.position.x ) * 0.05;
    camera.position.y += ( - mouseY - camera.position.y ) * 0.05;
    camera.position.x += ( pageX - camera.position.x ) ;
    camera.position.y += ( - pageY - camera.position.y ) ;
    camera.lookAt( scene.position );

    for (var i = 0; i < scene.children.length; i++) {
      if(scene.children[i].scale.x < 0.1){
        scene.remove( scene.children[i]);
        scene.children.splice(i, 1);
      }else{
      };
    }

    renderer.render( scene, camera );
}
