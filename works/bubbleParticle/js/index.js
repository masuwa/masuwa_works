   window.addEventListener('load', init);
    window.addEventListener('load', handleResize);//ロード時リサイズをかける
    var stage;
    var angle = 0;
    var particles;
    var objectPool = []; // オブジェクトプール
    var flame = 0;

    function init() {
      stage = new createjs.Stage('myCanvas');
      if(createjs.Touch.isSupported() == true){
        createjs.Touch.enable(stage)
      }

      window.addEventListener("resize", function(){
        handleResize();
      });

      document.addEventListener( 'mousemove', onDocumentMouseMove, false );
      //マウスが動いたら
      function onDocumentMouseMove(event) {
        var particles = new Particle(50, "#ffefd1", 20, 20, 100, getRandom(0.8, .95))//(size,color,vx,vy,life, gravity)
        stage.addChild(particles);
      }

      //タッチしてうごかしたら
      document.addEventListener( 'touchmove', onDocumentTouchMove, false );
      function onDocumentTouchMove(event) {
        var particles = new Particle(50, "#ffefd1", 20, 20, 100, getRandom(0.8, .95))//(size,color,vx,vy,life, gravity)
        stage.addChild(particles);
      }

      window.addEventListener("devicemotion", devicemotionHandler);
      function devicemotionHandler(event) {
        var bound = 0.8;
        var x = event.acceleration.x;
        var y = event.acceleration.y;
        var z = event.acceleration.z;
        if (x > bound || y > bound || z > bound) {
          var particles = new Particle(50, "#ffefd1", 40, 60, 100, getRandom(0.9, .5))//(size,color,vx,vy,life, gravity)
          particles.x = stage.canvas.width * Math.random();
          particles.y = (stage.canvas.height * Math.random())+stage.canvas.height;
        }
        stage.addChild(particles);
      }

      createjs.Ticker.addEventListener("tick", handleTick);
      createjs.Ticker.framerate = 60;
      function handleTick(event) {

        flame ++;
        if (flame %2 == 0) {
          var particlesEmit = new ParticleEmit(50, "#ffefd1", 40, 100,  200, getRandom(0.8, .95))
          stage.addChild(particlesEmit);
        }
        stage.update();
      }

    }

    class Particle extends createjs.Container {
      constructor(size,color,vx,vy,life,gravity) {
        super();
        this.particleList = [];
        this.size = size;
        this.color = color;
        this.vx = vx;
        this.vy = vy;
        this.life = life;
        this.gravity = gravity;

        for (var i = 0; i < 6; i++) {
          var particle = fromPool();
          particle.graphics
                  .beginFill(this.color)
                  .drawCircle(0, 0, Math.random()*Math.random()*this.size);
          particle.cache(-this.size, -this.size, this.size * 2, this.size * 2);
          particle.x = stage.mouseX + 60 * (Math.random() - 0.5);
          particle.y = stage.mouseY + 60 * (Math.random() - 0.5);
          this.addChild(particle);
          particle.vx = this.vx * (Math.random() - 0.5);
          particle.vy = this.vy * (Math.random() - 0.5);
          particle.life = this.life;
          this.particleList.push(particle);
        }
        this.on('tick', this.update, this);
      }
      update(){
        for(var i = 0; i < this.particleList.length; i++){
          var particle = this.particleList[i]
          particle.vy -= 1;
          particle.vx *= this.gravity;
          particle.vy *= this.gravity;
          particle.x += particle.vx;
          particle.y +=  particle.vy;
          particle.life -= 1;
          particle.alpha = particle.life/100;
          particle.scaleX = particle.scaleY =  particle.life/360;

          if (particle.life <= 0) {
            toPool(this.particleList[i]);
            stage.removeChild(this.particleList[i]);
            this.particleList.splice(i, 1);
            i -= 1;
          }

          this.addChild(particle);
        }
      }
    }

    class ParticleEmit extends createjs.Container {
      constructor(size,color,vx,vy,life,gravity) {
        super();
        this.particleEmitList = [];
        this.size = size;
        this.color = color;
        this.vx = vx;
        this.vy = vy;
        this.life = life;
        this.gravity = gravity;

        for (var i = 0; i < 2; i++) {
          var particleEmit = fromPool();
          particleEmit.graphics
                  .beginFill(this.color)
                  .drawCircle(0, 0, Math.random()*Math.random()*this.size);
          particleEmit.cache(-this.size, -this.size, this.size * 2, this.size * 2);
          particleEmit.x = stage.canvas.width*Math.random();
          particleEmit.y = stage.canvas.height;
          this.addChild(particleEmit);
          particleEmit.vx = this.vx * (Math.random() - 0.5);
          particleEmit.vy = this.vy * (Math.random() - 0.5);
          particleEmit.life = this.life;
          this.particleEmitList.push(particleEmit);
        }
        this.on('tick', this.update, this);
      }
      update(){
        for(var i = 0; i < this.particleEmitList.length; i++){
          var particleEmit = this.particleEmitList[i]
          particleEmit.vy -= 1;
          particleEmit.vx *= this.gravity;
          particleEmit.vy *= this.gravity;
          particleEmit.x += particleEmit.vx;
          particleEmit.y +=  particleEmit.vy;
          particleEmit.life -= 1;
          particleEmit.alpha = 0.3;
          particleEmit.scaleX = particleEmit.scaleY =  particleEmit.life/360;

          if (particleEmit.life <= 0) {
            toPool(this.particleEmitList[i]);
            stage.removeChild(this.particleEmitList[i]);
            this.particleEmitList.splice(i, 1);
            i -= 1;
          }
          this.addChild(particleEmit);
        }
      }
    }

    function handleResize() {
      var w = window.innerWidth;
      var h = window.innerHeight;
      stage.canvas.width = w;
      stage.canvas.height = h;
      stage.update();
    }

    function toPool(particle) {
      objectPool.unshift(particle);
    }

    function fromPool() {
      if (objectPool.length === 0) {
        return new createjs.Shape();
      } else {
        return objectPool.pop();
      }
    }

    function getRandom(min, max) {
      return Math.random() * (max - min) + min;
    }
