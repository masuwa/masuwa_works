window.addEventListener('load', init);
    window.addEventListener('load', handleResize);//ロード時リサイズをかける
    var stage;
    var tile;

    function init() {
      stage = new createjs.Stage('myCanvas');
      var tileNum = 120;
      var tiles1 = new Pattern(tileNum,"#ffffff", 0);
      stage.addChild(tiles1);
      var tiles2 = new Pattern(tileNum,"#f9531f", 0.5);
      stage.addChild(tiles2);
      var tiles3 = new Pattern(tileNum,"#0038c7", 0.5);
      stage.addChild(tiles3);
      var tiles4 = new Pattern(tileNum,"#ff5a4f", 0.5);
      stage.addChild(tiles4);
      var tiles5 = new Pattern(tileNum,"#00e0ff", 0.5);
      stage.addChild(tiles5);
      var tiles6 = new Pattern(tileNum,"#ffffff", 0.8);
      stage.addChild(tiles6);



      window.addEventListener("resize", function(){
        handleResize();
        stage.addChild(shape); // 表示リストに追加
      });

      createjs.Ticker.addEventListener("tick", stage);
      createjs.Ticker.timingMode = createjs.Ticker.RAF;
      function handleTick(event) {
        stage.update();
      }
    }

    class Pattern extends createjs.Container {
      constructor(tileNum,color,value) {
        super();
        this.x = window.innerWidth/2 - tileNum*100*0.2/2;
        this.y = window.innerHeight/2 - tileNum*100*0.2/2;
        for(var j = 0; j < tileNum; j++){
          for (var i = 0; i < tileNum*2; i++) {
            var size = 20;
            var r = getRandom(0, 1);
            if (r > value) {
              this.tile = new createjs.Shape();
              this.tile.graphics.beginFill(color);
              this.tile.regX = this.tile.regY = size;
              this.tile.alpha = Math.cos(i)*Math.sin(j);
              this.tile.graphics.drawRoundRect(0, 0, size/Math.floor(getRandom(1,2)), size/Math.floor(getRandom(1,2)), getRandom(0,12), getRandom(0,12));
              this.addChild(this.tile);
              this.tile.x = 50*i*0.2;
              this.tile.y = 50*j*0.2;
            }
          }
        }
          this.on('tick', this.update, this);
      }

      update(tileNum) {
        this.x = window.innerWidth/2 - tileNum*100*0.2/2;
        this.y = window.innerHeight/2 - tileNum*100*0.2/2;
      }
    }

    function handleResize(tiles,tileNum) {
      var w = window.innerWidth;
      var h = window.innerHeight;
      stage.canvas.width = w;
      stage.canvas.height = h;
      stage.update();
    }

    function getRandom(min, max) {
      return Math.random() * (max - min) + min;
    }