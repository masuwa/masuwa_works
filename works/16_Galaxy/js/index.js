if ( WEBGL.isWebGLAvailable() === false ) {
				document.body.appendChild( WEBGL.getWebGLErrorMessage() );
			}
			var camera, composer, renderer;
			var box, torus;

      var mesh, mesh2;

      window.addEventListener('load', init);
			function init() {


        camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
				camera.position.z = 10;

        var scene = new THREE.Scene();
        var scene2 = new THREE.Scene();



        mesh = new Donuts(0.5,5);
        scene.add(mesh);

        mesh2 = new Donuts(0.5,-5);
        scene2.add(mesh2);

        renderer = new THREE.WebGLRenderer({
          alpha: true
        });
        renderer.setClearColor( 0x070f1b, 1 );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.autoClear = false;
        document.body.appendChild( renderer.domElement );


				var clearPass = new THREE.ClearPass();
				var clearMaskPass = new THREE.ClearMaskPass();

				var maskPass1 = new THREE.MaskPass( scene, camera );
        var maskPass2 = new THREE.MaskPass( scene2, camera );

				var texture1 = new THREE.TextureLoader().load( 'img/01.jpg' );
				texture1.minFilter = THREE.LinearFilter;
        var texture2 = new THREE.TextureLoader().load( 'img/02.jpg' );

				var texturePass1 = new THREE.TexturePass( texture1 );
        var texturePass2 = new THREE.TexturePass( texture2 );

				var outputPass = new THREE.ShaderPass( THREE.CopyShader );

				var parameters = {
					minFilter: THREE.LinearFilter,
					magFilter: THREE.LinearFilter,
					format: THREE.RGBFormat,
					stencilBuffer: true
				};

				var renderTarget = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, parameters );

        composer = new THREE.EffectComposer( renderer, renderTarget );
				composer.addPass( clearPass );
				composer.addPass( maskPass1 );
				composer.addPass( texturePass1 );
				composer.addPass( clearMaskPass );
				composer.addPass( maskPass2 );
				composer.addPass( texturePass2 );
				composer.addPass( clearMaskPass );
				composer.addPass( outputPass );
				window.addEventListener( 'resize', onWindowResize, false );

        animate();
			}

      class Donuts extends THREE.Object3D {
        constructor(radian,pos) {
          super();
          this.array = [];
          this.angle = 0;

          for(var i = 0; i < 10; i++) {
            this.mesh = new THREE.Mesh(
              new THREE.TorusBufferGeometry( radian*i, 0.1,  10, 100 ),
              new THREE.MeshBasicMaterial( { color: "black" } )
            );
            this.array[i] = this.mesh;
            this.add(this.mesh);
          }
          this.position.x = pos;
          this.position.y = pos;

        }
        update(d) {
          for(var i = 0; i < this.array.length; i++) {
            this.array[i].rotation.x += 0.001*i*d;
            this.array[i].rotation.y += 0.001*i*d;
            this.array[i].rotation.z += 0.001*i*d;
            this.array[i].scale.x = Math.abs(Math.cos(this.angle))+i*2;
            this.array[i].scale.y = Math.abs(Math.cos(this.angle))+i*2;

            this.angle += 0.001;
          }
        }
      }

			function onWindowResize() {
				var width = window.innerWidth;
				var height = window.innerHeight;
				camera.aspect = width / height;
				camera.updateProjectionMatrix();
				renderer.setSize( width, height );
				composer.setSize( width, height );
			}

			function animate() {
				requestAnimationFrame( animate );
				var time = performance.now() * 0.001;
        mesh.update(1);
        mesh2.update(-1);
				renderer.clear();
				composer.render( time );
			}
