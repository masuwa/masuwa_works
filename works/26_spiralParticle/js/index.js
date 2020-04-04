
  window.addEventListener('load', init);
    window.addEventListener('load', handleResize);//ロード時リサイズをかける
    var stage, container;
    var angle = 0;
    var count = 0;
    var particles;

    var golden_ratio = (Math.sqrt(5)-1)/2;
    var theta = 2*Math.PI/golden_ratio;

    var particleList = [];

    function init() {
      stage = new createjs.Stage('myCanvas');
      container = new createjs.Container();
      stage.addChild(container);

      container.x = stage.canvas.width/2;
      container.y = stage.canvas.height/2;


      window.addEventListener("resize", function(){
        handleResize();
      });

      particles = new Particle(30);
      container.addChild(particles);


      createjs.Ticker.addEventListener("tick", handleTick);
      //createjs.Ticker.timingMode = createjs.Ticker.RAF;
      createjs.Ticker.framerate = 60;
      function handleTick(event) {
        stage.update();
      }

    }

    class Particle extends createjs.Container {
      constructor(size) {
        super();
        this.particleList = [];
        this.size = size;
        for (var i = 0; i < 1400; i++) {
          var particle = new createjs.Shape();
          if (i % 2 == 0) {
            particle.graphics
                    .beginFill("#FFF")
                    .drawCircle(0, 0, this.size);
          }else{
            particle.graphics
                    .beginFill("#0000FF")
                    .drawCircle(0, 0, this.size);
          }
          particle.cache(-this.size, -this.size, this.size * 2, this.size * 2);
          particle.x = i * Math.cos(i*theta)*0.3;
          particle.y = i * Math.sin(i*theta)*0.3;
          particle.scale = Math.cos(i*theta)*Math.sin(i*theta);
          //particle.alpha = getRandom(0.2, 1);
          //particle.compositeOperation = "lighter";

          this.addChild(particle);

          this.addChild(particle);
          this.particleList.push(particle);
        }
        this.on('tick', this.update, this);
      }
      update(){
        count ++;
        for (var i = 0; i < this.particleList.length; i++) {
          var particle = this.particleList[i]

          particle.x += Math.cos(count*0.05+i*0.1)*0.2;
          particle.y += Math.sin(count*0.05+i*0.1)*0.2;
          //particle.alpha = Math.cos(count*0.05+i*Math.abs(Math.sin(count*0.005)*0.01))+0.1;
          particle.alpha = Math.cos(
            count*0.05 + i * Math.abs(
              Math.sin(count*0.002 + 0.25) * Math.cos(count*0.002) * 0.01
            )
          )+0.1;

          particle.scale = Math.cos(count*0.05+i*0.1)*Math.abs(Math.cos(count*0.05+i*0.1));
        }
      }
    }



    function handleResize() {

      var w = window.innerWidth;
      var h = window.innerHeight;
      stage.canvas.width = w;
      stage.canvas.height = h;

      container.x = stage.canvas.width/2;
      container.y = stage.canvas.height/2;
      stage.update();
    }

      function getRandom(min, max) {
        return Math.random() * (max - min) + min;
      }
