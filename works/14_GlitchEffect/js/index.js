THREE.GlitchPass = function ( dt_size ) {

			THREE.Pass.call( this );

			var shader = THREE.DigitalGlitch = {

				uniforms: {
					"tDiffuse":		{ value: null },//diffuse texture
					"tDisp":		{ value: null },//displacement texture for digital glitch squares
					"byp":			{ value: 0 },//apply the glitch ?
					"amount":		{ value: 0.0 },
					"angle":		{ value: 0.0 },
					"seed":			{ value: 0.02 },
					"seed_x":		{ value: 0.02 },//-1,1
					"seed_y":		{ value: 0.02 },//-1,1
					"distortion_x":	{ value: 0 },
					"distortion_y":	{ value: 0 },
					"col_s":		{ value: 0.0 }
				},

				vertexShader: [
					"varying vec2 vUv;",
					"void main() {",
						"vUv = uv;",
						"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
					"}"
				].join( "\n" ),

				fragmentShader: [
					"uniform int byp;",//should we apply the glitch ?

					"uniform sampler2D tDiffuse;",
					"uniform sampler2D tDisp;",

					"uniform float amount;",
					"uniform float angle;",
					"uniform float seed;",
					"uniform float seed_x;",
					"uniform float seed_y;",
					"uniform float distortion_x;",
					"uniform float distortion_y;",
					"uniform float col_s;",

					"varying vec2 vUv;",


					"float rand(vec2 co){",
						"return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);",
					"}",

					"void main() {",
						"if(byp<1) {",
							"vec2 p = vUv;",
							"float xs = floor(gl_FragCoord.x / 0.5);",
							"float ys = floor(gl_FragCoord.y / 0.5);",
							//based on staffantans glitch shader for unity https://github.com/staffantan/unityglitch
							"vec4 normal = texture2D (tDisp, p*seed*seed);",
							"if(p.y<distortion_x+col_s && p.y>distortion_x-col_s*seed) {",
								"if(seed_x>0.){",
									"p.y = 1. - (p.y + distortion_y);",
								"}",
								"else {",
									"p.y = distortion_y;",
								"}",
							"}",
							"if(p.x<distortion_y+col_s && p.x>distortion_y-col_s*seed) {",
								"if(seed_y>0.){",
									"p.x=distortion_x;",
								"}",
								"else {",
									"p.x = 1. - (p.x + distortion_x);",
								"}",
							"}",
							"p.x+=normal.x*seed_x*(seed/5.);",
							"p.y+=normal.y*seed_y*(seed/5.);",
							//base from RGB shift shader
							"vec2 offset = amount * vec2( cos(angle), sin(angle));",
							"vec4 cr = texture2D(tDiffuse, p + offset);",
							"vec4 cga = texture2D(tDiffuse, p);",
							"vec4 cb = texture2D(tDiffuse, p - offset);",
							"gl_FragColor = vec4(cr.r, cga.g, cb.b, cga.a);",
							//add noise
							"vec4 snow = 20.*amount*vec4(rand(vec2(xs * seed,ys * seed*50.))*0.2);",
							"gl_FragColor = gl_FragColor+ snow;",
						"}",
						"else {",
							"gl_FragColor=texture2D (tDiffuse, vUv);",
						"}",
					"}"

				].join( "\n" )

			};

			this.uniforms = THREE.UniformsUtils.clone( shader.uniforms );
			// if ( dt_size == undefined ) dt_size = 64;


			this.uniforms[ "tDisp" ].value = this.generateHeightmap( dt_size );

			this.material = new THREE.ShaderMaterial( {
				uniforms: this.uniforms,
				vertexShader: shader.vertexShader,
				fragmentShader: shader.fragmentShader
			} );

			this.camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
			this.scene  = new THREE.Scene();

			this.quad = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), null );
			this.scene.add( this.quad );

			this.curF = 0;
			this.randX = THREE.Math.randInt( 120, 240 );

		};

		THREE.GlitchPass.prototype = Object.assign( Object.create( THREE.Pass.prototype ), {

			constructor: THREE.GlitchPass,

			render: function ( renderer, writeBuffer, readBuffer, delta, maskActive ) {

				this.uniforms[ "tDiffuse" ].value = readBuffer.texture;
				this.uniforms[ 'seed' ].value = Math.random()*10;//default seeding
				this.uniforms[ 'byp' ].value = 0;
				this.uniforms[ 'angle' ].value = THREE.Math.randFloat( - Math.PI, Math.PI );
				// this.uniforms[ 'seed_x' ].value = THREE.Math.randFloat( - 1, 1 );
				// this.uniforms[ 'seed_y' ].value = THREE.Math.randFloat( - 1, 1 );
				this.uniforms[ 'distortion_x' ].value = THREE.Math.randFloat( 0, 1 );
				this.uniforms[ 'distortion_y' ].value = THREE.Math.randFloat( -1, 1 );
				this.curF = 0;
				this.randX = THREE.Math.randInt( 120, 240 );


				this.curF ++;
				this.quad.material = this.material;

				if ( this.renderToScreen ) {
					renderer.render( this.scene, this.camera );
				} else {
					renderer.render( this.scene, this.camera, writeBuffer, this.clear );
				}

			},


			generateHeightmap: function( dt_size ) {

				var data_arr = new Float32Array( dt_size * dt_size * 3 );
				var length = dt_size * dt_size;
				for ( var i = 0; i < length; i ++ ) {
					var val = THREE.Math.randFloat( 0, 1 );
					data_arr[ i * 3 + 0 ] = val;
					data_arr[ i * 3 + 1 ] = val;
					data_arr[ i * 3 + 2 ] = val;

				}

				var texture = new THREE.DataTexture( data_arr, dt_size, dt_size, THREE.RGBFormat, THREE.FloatType );
				texture.needsUpdate = true;
				return texture;

			}

		} );

			var camera, scene, renderer, composer;
			var object, light;
			var angle = 0;

			var glitchPass;

			init();
			animate();

			function init() {

				renderer = new THREE.WebGLRenderer({alpha:true});
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				document.body.appendChild( renderer.domElement );

				camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
				camera.position.z = 1;

				scene = new THREE.Scene();
				scene.fog = new THREE.Fog( 0x000000, 1, 1000 );

				// 画像を読み込む
				var texture = new THREE.TextureLoader().load('img/01.jpg',
				function(tex){
					// 縦横比を保って適当にリサイズ
					const w = 2;
					const h = tex.image.height/(tex.image.width/w);

					// 平面
					const geometry = new THREE.PlaneGeometry(1, 1);
					const material = new THREE.MeshPhongMaterial( { map:texture } );
					const plane = new THREE.Mesh( geometry, material );
					plane.scale.set(w, h, 0);
					scene.add( plane );
				});

				scene.add( new THREE.AmbientLight( 0x222222 ) );

				light = new THREE.DirectionalLight( 0xffffff );
				light.position.set( 1, 1, 1 );
				scene.add( light );

				//EffectComposerを作成
				composer = new THREE.EffectComposer( renderer );
				//ComposerにRebderPassを追加
				composer.addPass( new THREE.RenderPass( scene, camera ) );

				//glitchpassを追加
				glitchPass = new THREE.GlitchPass();
				glitchPass.renderToScreen = true;
				composer.addPass( glitchPass );

				window.addEventListener( 'resize', onWindowResize, false );

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );
				composer.setSize( window.innerWidth, window.innerHeight );


			}

			function animate() {

				requestAnimationFrame( animate );
				glitchPass.uniforms.col_s.value = Math.cos(angle)*Math.sin(angle);
				glitchPass.uniforms.amount.value = Math.cos(angle)*0.01;
				if(glitchPass.uniforms.col_s.value > Math.random()){
					camera.position.y = Math.cos(angle*100)*Math.random();
					camera.position.x = Math.sin(angle*100)*10*Math.random();
				}else{
					camera.position.y =0;
					camera.position.x = 0;
				}

				angle+= 0.009;


				composer.render();

			}
