window.addEventListener('load', init);
      function init() {

        // レンダラーを作成
        const renderer = new THREE.WebGLRenderer({
          canvas: document.querySelector('#myCanvas'),
          alpha: true,
          antialias: true
        });

        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth , window.innerHeight);
        renderer.setClearColor(0x000000); // the default
        console.log(renderer);
        // renderer.toneMapping = THREE.ReinhardToneMapping;

        var ENTIRE_SCENE = 0, BLOOM_SCENE = 1;
  			var bloomLayer = new THREE.Layers();
  			bloomLayer.set( BLOOM_SCENE );

        const scene = new THREE.Scene();
        scene.background = new THREE.Color( 0x011011 );
        scene.fog = new THREE.Fog( 0xFFFFFF, 100, 2500 );
        const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight);
        camera.position.set(0, 0, 1000);
        camera.lookAt(new THREE.Vector3(0, 0, 0));


        var renderScene = new THREE.RenderPass( scene, camera );
        var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
        effectCopy.renderToScreen = true;

        var bloomPass = new THREE.UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
        bloomPass.exposure = 1.0;
        bloomPass.threshold = 0.2;
  			bloomPass.strength = 1.4;
  			bloomPass.radius = 0.8;



        var bloomComposer = new THREE.EffectComposer( renderer );
        bloomComposer.renderToScreen = true;
        bloomComposer.addPass( renderScene );
        bloomComposer.addPass( bloomPass );
        bloomComposer.addPass( effectCopy );



        var finalPass = new THREE.ShaderPass(
          new THREE.ShaderMaterial( {
            uniforms: {
              baseTexture: { value: null },
              bloomTexture: { value: bloomComposer.renderTarget2.texture }
            },
            vertexShader: document.getElementById( 'vertexshader' ).textContent,
            fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
            defines: {}
          } ), "baseTexture"
        );


        finalPass.needsSwap = true;


        var finalComposer = new THREE.EffectComposer( renderer );
        finalComposer.addPass( renderScene );
        finalComposer.addPass( finalPass );
        finalComposer.addPass( effectCopy );
        var raycaster = new THREE.Raycaster();

        window.addEventListener( 'resize', function(){
          onWindowResize(camera, renderer,bloomComposer, finalComposer);
        }, false );


        var donutu = new Circle(BLOOM_SCENE, 0x00d9ff);
        scene.add(donutu);

        var donutu2 = new Circle(BLOOM_SCENE, 0xff0099);
        donutu2.position.set(-30,0,0)
        scene.add(donutu2);





        camera.layers.set( BLOOM_SCENE );
        scene.layers.set( BLOOM_SCENE );

        var angle = 0;

        tick();

        function tick() {
          // for (var i = 0; i < circleList.length; i++) {
          //   circleList[i].update(i, bloomPass);
          // }
          donutu.update();

          donutu2.update2();

          bloomPass.strength = Math.abs(Math.sin(Math.sin(angle)*Math.PI*1))+1;

          angle += 0.01;

          renderer.render(scene, camera);
          requestAnimationFrame(tick);
          bloomComposer.render();
          finalComposer.render();
        }
      }


      class Circle extends THREE.Object3D {
        constructor(BLOOM_SCENE,color) {
          super();
          const length = 10;
          this.t = 1;
          this.donutsList = [];
          this.castShadow = true;
          this.angle = 0;
          for (let i = 0; i < length; i++) {
            this.donuts = new THREE.Mesh(
              new THREE.BoxBufferGeometry( 10, 60, 10 ),
              new THREE.MeshBasicMaterial({
                color: color
              })
            );
            const radian = i / length * Math.PI * 2;
            this.donuts.position.set(
              60*i-(60*length+10*length)/4-(60*length+10*length)/8,
              0,
              0// Z座標
            );

            this.donuts.layers.enable(BLOOM_SCENE);

            this.add(this.donuts);
            this.donutsList.push(this.donuts);
          }

        }

        update() {
          for (let i = 0; i < this.donutsList.length; i++) {
            this.donutsList[i].scale.y = Math.abs(Math.sin(this.angle+i/4)*5);
            this.angle += 0.001;
          }
        }

        update2() {
          for (let i = 0; i < this.donutsList.length; i++) {
            this.donutsList[i].scale.y = Math.abs(Math.cos(this.angle+i/4)*5);
            this.angle += 0.001;
          }
        }
      }

      function onWindowResize(camera, renderer, bloomComposer, finalComposer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
        bloomComposer.setSize( window.innerWidth, window.innerHeight );
        finalComposer.setSize( window.innerWidth, window.innerHeight );
      }