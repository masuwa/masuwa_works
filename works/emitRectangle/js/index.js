    window.addEventListener('load', init);
    function init() {
      const floorPos = -150;
      let count = 0;
      let mesh;
      let meshList = [];

      const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#myCanvas'),
        antialias: true
      });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth , window.innerHeight);
      renderer.shadowMap.enabled = true; //影を入れる
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight);
      camera.position.set(0, 0, 1200);
      camera.lookAt(new THREE.Vector3(0, 0, 0));

      const controls = new THREE.OrbitControls(camera);
      controls.enabled = false;
      controls.autoRotate = true;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color( 0xeefdff );
      scene.fog = new THREE.Fog( 0xf6d9fa, 50, 2000 );

      const dirLight = new THREE.DirectionalLight( 0x4c1854, 0.15 );
      dirLight.position.set( 0, 500, 200 );
      scene.add( dirLight );
      const pointLight = new THREE.PointLight( 0xffffff, 1.2 );
      pointLight.position.set( 0, 100, 0 );
      scene.add( pointLight );
      const ambientLight = new THREE.AmbientLight(0x0d5f6b);
      scene.add( ambientLight );// 環境光源

      const plane = new THREE.Mesh(
        new THREE.PlaneBufferGeometry( 10000, 10000 ),
        new THREE.MeshPhongMaterial( { color: 0xd1f9ff, opacity: 0.7, transparent: true } )
      );

      plane.position.y =  floorPos;
      plane.rotation.x = - Math.PI / 2;
      plane.receiveShadow = true;
      scene.add( plane );


      window.addEventListener( 'resize', function(){
        onWindowResize(camera, renderer);
      }, false );

      tick();
      function tick() {
        renderer.render(scene, camera);
        if (count % 30 == 0) {
          mesh = new MyGroup(floorPos);
          scene.add(mesh);
          meshList.push(mesh);
        }else{}
        for (var i = 0; i < meshList.length; i++) {
          meshList[i].update();
        }

        controls.update();
        requestAnimationFrame(tick);
        count = count + 1;
      }
    }

    class MyGroup extends THREE.Object3D {
      constructor(floorPos) {
        super();
        this.barList = [];
        this.gravity = getRandom(0.55, 0.9);
        this.vy = 20;
        for (let i = 0; i < 4; i++) {
          this.bar = new THREE.Mesh(
            new THREE.BoxBufferGeometry( 50, 1000, 50 ),
            new THREE.MeshPhongMaterial({ color: 0xFFFFFF })
          );
          this.bar.castShadow = true;
          const radian = i / length * Math.PI * 2;
          this.bar.position.set(
            getRandom(-1000, 1000), // X座標
            getRandom(floorPos-3000, floorPos-1000), // Y座標
            getRandom(-1000, 1000)// Z座標
          );
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
          this.barList[i].scale.y *= 1.001;
          //y座標一定値まですぎたら削除
          if (this.barList[i].position.y > 0) {
            this.barList[i].scale.y *= 0.99;
          }
          if (this.barList[i].position.y > 4000) {
            this.remove(this.barList[i]);
            this.barList.splice(i, 1);
            i -= 1;
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

    function getRandom(min, max) {
      return Math.random() * (max - min) + min;
    }
