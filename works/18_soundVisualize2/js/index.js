var scene, camera, renderer, analyser, cube, cubeList = [];

			init();

			function init() {
				var fftSize = 256/2;
				var startButton = document.getElementById( 'startButton' );

				var container = document.getElementById( 'container' );
				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.setClearColor( 0xffffff );
				renderer.setPixelRatio( window.devicePixelRatio );
				container.appendChild( renderer.domElement );

				scene = new THREE.Scene();
				scene.fog = new THREE.Fog( 0xffffff, 0, 1000 );

				camera = new THREE.PerspectiveCamera( 160, window.innerWidth / window.innerHeight, 1, 4000 );
				camera.position.z = 500;

				var light = new THREE.PointLight( 0xff0000 );
				light.position.z = 400;
				camera.add( light );
				scene.add( camera );

				var listener = new THREE.AudioListener();
				var audio = new THREE.Audio( listener );
				var audioLoader = new THREE.AudioLoader();
				audioLoader.load(
				'sound/sound.m4a',
				function( buffer ) {
					audio.setBuffer( buffer );
					audio.setLoop( true );
					audio.setVolume( 1.0 );
					//audio.play();
				},
				function ( xhr ) {
					if (xhr.loaded / xhr.total * 100 === 100) {
            setTimeout(() => {
                startButton.textContent = "Play";
                startButton.addEventListener( 'click', soundPlay );
            }, 1000)

					}else{

					}
				}

				);

				function soundPlay(){
					var overlay = document.getElementById( 'overlay' );
					overlay.remove();
					audio.play();
				}

				analyser = new THREE.AudioAnalyser( audio, fftSize );



				//カスタムシェーダー
				var mat = new THREE.ShaderMaterial({
					uniforms: {},
					vertexShader: document.getElementById('vertexShader').textContent,
					fragmentShader: document.getElementById('fragmentShader').textContent
				});


				for (var i = 0; i < fftSize; i++) {
					var geometry = new THREE.BoxGeometry( 10, 10, 10 );
					cube = new THREE.Mesh( geometry, mat );
					cube.rotation.z = Math.random()*360;
					cube.position.set(
					getRandom(-400, 400),
					getRandom(-400, 400),
					getRandom(0, 0))
					scene.add( cube );
					cubeList[i] = cube;
				}

				window.addEventListener( 'resize', onResize, false );
				animate();
			}
			function onResize() {
				// renderer.setSize( window.innerWidth, window.innerHeight );
			}
			function animate() {
				requestAnimationFrame( animate );
				render();
			}
			function render() {
				analyser.getFrequencyData();

				for (var i = 0; i < cubeList.length; i++) {
					cubeList[i].scale.y = analyser.data[i]/25;
					cubeList[i].scale.x = analyser.data[i]/25;
					cubeList[i].scale.z = analyser.data[i]/2;
				}
				camera.rotation.z += 0.005;
				renderer.render( scene, camera );
			}
			function getRandom(min, max) {
			  return Math.random() * (max - min) + min;
			}
