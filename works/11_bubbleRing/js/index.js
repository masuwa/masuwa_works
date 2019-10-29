// ページの読み込みを待つ
      window.addEventListener('load', init);
      function init() {

        // レンダラーを作成
        const renderer = new THREE.WebGLRenderer({
          canvas: document.querySelector('#myCanvas'),
          antialias: true
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth , window.innerHeight);
        renderer.setClearColor(0x080666, 1.0);
        console.log(renderer);

        const scene = new THREE.Scene();
        scene.fog = new THREE.Fog( 0xc8c6ff, -500, 500 );
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight);
        camera.position.set(0, 0, 500);


        window.addEventListener( 'resize', function(){
          onWindowResize(camera, renderer);
        }, false );

        const circleList = [];

        for (var i = 0; i < 1080; i++) {
          circleList[i] = new Circle(i/108);
          scene.add(circleList[i]);
        }

        tick();

        function tick() {
          for (var i = 0; i < circleList.length; i++) {
            circleList[i].update(i);
          }
          renderer.render(scene, camera);
          requestAnimationFrame(tick);
        }
      }

      class Circle extends THREE.Object3D {
        constructor(size) {
          super();
          this.size = size;
          this.count = 0;
          this.material = new THREE.LineBasicMaterial({
          	color: 0xc8c6ff,
            transparent: true,
            opacity: 0.6
          });

          this.geometry = new THREE.Geometry();
          for (var i = 0; i < 361; i++) {
            const radian = i/360 * Math.PI * 2;
            this.geometry.vertices.push(
              new THREE.Vector3(
                Math.sin(radian)*this.size,
                Math.cos(radian)*this.size,
                30)
            );
          }
          this.line = new THREE.Line( this.geometry, this.material );
          this.add( this.line );

        }
        update(i) {
          this.line.position.x = Math.cos(i)*200;
          this.line.position.y = Math.sin(i)*200;
          this.line.rotation.x += i*0.00006;
          this.line.rotation.y += i*0.00006;
          this.line.rotation.z += i*0.00006;
        }
      }

      function onWindowResize(camera, renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
      }