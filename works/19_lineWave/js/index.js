var container, stats;
			var camera, scene, renderer, clock;
			var uniforms1, uniforms2;
			init();
			animate();
			function init() {
				container = document.getElementById( 'container' );
				scene = new THREE.Scene();
				clock = new THREE.Clock();
				camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -5000, 5000 );
				camera.position.set(30, 30, 30);
				camera.updateProjectionMatrix();
    		camera.lookAt(scene.position);


				var cubeSize = 80;

				var geometry = new THREE.BoxGeometry( 1,cubeSize*4,1 );
				uniforms1 = {
					"time": { value: 1.0 }
				};

				var material = new THREE.ShaderMaterial( {
					uniforms: uniforms1,
					vertexShader: document.getElementById( 'vertexShader' ).textContent,
					fragmentShader: document.getElementById( 'fragment_shader4' ).textContent
				} );
				for (var i = 0; i < 2000; i++) {
					var mesh = new THREE.Mesh( geometry, material );
					mesh.position.z = i*4-cubeSize*50;
					mesh.rotation.z = i*0.01;
					scene.add( mesh );
				}



				renderer = new THREE.WebGLRenderer({antialias: true});
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setClearColor( 0x222222 , 1 );
				container.appendChild( renderer.domElement );

				onWindowResize();
				window.addEventListener( 'resize', onWindowResize, false );
			}
			function onWindowResize() {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
			}
			//
			function animate() {
				requestAnimationFrame( animate );
				render();
			}
			function render() {
				var delta = clock.getDelta();
				uniforms1[ "time" ].value += delta * 5;
				camera.rotation.x += delta * 0.1 * ( i % 2 ? 1 : - 1 );
				camera.rotation.z += delta * 0.1 * ( i % 2 ? 1 : - 1 );
				for ( var i = 0; i < scene.children.length; i ++ ) {
					var object = scene.children[ i ];
					object.rotation.x += 0.04;
					object.rotation.z += 0.04;
					object.rotation.y += delta * 0.8 * ( i % 2 ? 1 : - 1 );
				}
				renderer.render( scene, camera );
			}
			function getRandom(min, max) {
			  return Math.random() * (max - min) + min;
			}