(function(){

  window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame;

  var canvas = document.querySelector("canvas");
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight;
  var ctx = canvas.getContext("2d");
  ctx.globalCompositeOperation = "source-over";
  var particles = [];
  var pIndex = 0;
  var x, y, frameId;

  function GetColor() {
      var r = 0, g = 0, b = 0;
      while (r < 100 && g < 100 && b < 100)
      {
          r = Math.floor(getRandom(130,256));
          g = Math.floor(getRandom(140,256));
          b = Math.floor(getRandom(200,256));
      }
      return "rgba(" + r + "," + g + ","  + b + "," + 0.1 + ")";
  }

  function Particle(x,y,vx,vy){
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    particles[pIndex] = this;
    this.id = pIndex;
    pIndex++;
    this.color = GetColor();
    this.life = 0;
    this.maxlife = 100;
  };

  Particle.prototype.draw = function(x, y){
    this.degree += 1;
    this.vx *= 1.01;//重力
    this.vy *= 1.01;//重力
    this.x += this.vx;//蛇行
    this.y += this.vy;
    this.width = this.size;
    this.height = this.size;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.fillRect(this.x, this.y, 1, 1);
    ctx.closePath();
    ctx.fill();
    this.life++;
    if(this.life >= this.maxlife){
      delete particles[this.id];
    }
  }
//リサイズ処理
  window.addEventListener("resize", function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    x = canvas.width / 2;
    y = canvas.height / 2;
  });

  function loop(){
    //全画面に色をしく。透過率をあげると残像が強くなる
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.fillRect(0,0, canvas.width, canvas.height);

    if(frameId % 1 == 0){
      for(var i = 1; i < 180; i++){
        new Particle(canvas.width/2+Math.sin(frameId*Math.PI/(180/i*frameId))*canvas.height/3,
                     canvas.height/2+Math.cos(frameId*Math.PI/(180/i*frameId))*canvas.height/3,
                     Math.sin(frameId*i*Math.PI/180),
                     Math.cos(frameId*i*Math.PI/180)
                    );
      }
    }


    if(frameId % 1 == 0){
      for(var i = 1; i < 180; i++){
        new Particle(canvas.width/2-Math.sin(frameId*Math.PI/(180/i*frameId))*canvas.height/3,
                     canvas.height/2-Math.cos(frameId*Math.PI/(180/i*frameId))*canvas.height/3,
                     Math.sin(frameId*i*Math.PI/180),
                     Math.tan(frameId*i*Math.PI/180)
                    );
      }
    }
    for(var i in particles){
      particles[i].draw();
    }
    frameId = requestAnimationFrame(loop);
  }

  loop();

  function getRandom(min, max) {
    return Math.random() * (max - min) + min;
  }

})();
