window.addEventListener('load', init);
    let uniforms;
    let clock, controls;
    function init() {
      let count = 0;
      let mesh;
      let meshList = [];

      clock = new THREE.Clock();

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: document.querySelector('#myCanvas'),
      });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth , window.innerHeight);
      renderer.shadowMap.enabled = true; //影を入れる
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 4000);
      camera.position.set(0, 0, 1500);
      camera.lookAt(new THREE.Vector3(0, 0, 0));

      controls = new THREE.OrbitControls(camera);
      controls.autoRotate = true;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color( 0xffffff );
      scene.fog = new THREE.Fog( 0x000000, 50, 200 );


      window.addEventListener( 'resize', function(){
        onWindowResize(camera, renderer);
      }, false );

      uniforms = {
        "time": { value: 1.0 },
        "colorTexture": { value: new THREE.TextureLoader().load( 'https://dl.dropbox.com/s/5g5hy4xbxvifnb3/bg.jpg?dl=0' ) },
      };
      uniforms[ "colorTexture" ].value.wrapS = uniforms[ "colorTexture" ].value.wrapT = THREE.RepeatWrapping;

      tick();
      function tick() {
        renderer.render(scene, camera);
        if (count % 2 == 0) {
          mesh = new MyGroup();
          scene.add(mesh);
          meshList.push(mesh);
        }else{}

        for (var i = 0; i < meshList.length; i++) {
          meshList[i].update();
        }

        // controls.update();
        requestAnimationFrame(tick);
        controls.update();
        count = count + 1;
      }
    }

    class MyGroup extends THREE.Object3D {
      constructor() {
        super();
        this.barList = [];
        this.gravity = 1.02;
        this.vy = 0;


        for (let i = 0; i < 1; i++) {
          var rand = Math.floor(getRandom(2,10)*20);
          this.bar = new THREE.Mesh(
            new THREE.BoxBufferGeometry(rand,rand,rand ),
            new THREE.ShaderMaterial( {
    					uniforms: uniforms,
    					vertexShader: document.getElementById( 'vertexShader' ).textContent,
    					fragmentShader: document.getElementById( 'fragmentShader' ).textContent
				    } )
          );
          // this.bar.castShadow = true;

          const radian = i / length * Math.PI * 2;
          this.bar.position.set(
            getRandom(-window.innerWidth, window.innerWidth), // X座標
            -2000, // Y座標
            getRandom(-window.innerWidth, window.innerWidth)// Z座標
          );

          this.bar.rotation.x = Math.PI/2*Math.floor(getRandom(0,4));
          this.bar.rotation.y = Math.PI/2*Math.floor(getRandom(0,4));
          this.bar.rotation.z = Math.PI/2*Math.floor(getRandom(0,4));

          this.bar.vy =  this.vy * (Math.random() - 0.5);
          this.add(this.bar);
          this.barList.push(this.bar);
        }
      }

      update() {
        for (let i = 0; i < this.barList.length; i++) {
          this.barList[i].vy += 1;
          this.barList[i].vy *= this.gravity;
          this.barList[i].position.y += this.barList[i].vy;

          // this.barList[i].rotation.y += .1;

          //y座標一定値まですぎたら削除
          if (this.barList[i].position.y > 0) {
            this.barList[i].vy /= 1.5;
          }
          if (this.barList[i].position.y > 2000) {
            this.remove(this.barList[i]);
            this.barList.splice(i, 1);
          }
        }
        var delta = clock.getDelta();
        uniforms[ "time" ].value += delta * 1;
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

    function getRandom(min, max) {
      return Math.random() * (max - min) + min;
    }