window.addEventListener('load', init);
    window.addEventListener('load', handleResize);//ロード時リサイズをかける
    var radian = 120;
    var stage;
    var max = 0;
    var min = 8;
    var random = Math.floor( Math.random() * (max - min + 1) )
    function init() {
      stage = new createjs.Stage('myCanvas');

      var curves = new Curves(-1);
      stage.addChild(curves);

      var curves_b = new Curves(-1);
      // curves_b.x += radian*6;
      stage.addChild(curves_b);


      createjs.Ticker.addEventListener("tick", stage);
      createjs.Ticker.timingMode = createjs.Ticker.RAF;

      window.addEventListener( 'resize', handleResize, false );
      stage.update();

    }


    //線の座標クラス
    class Line extends createjs.Shape {
      constructor(x1, y1, x2, y2, x3, y3, i, color) {
        super();
        // 円を作成します
        this.graphics.beginStroke(color).setStrokeStyle(.3).moveTo(x1,y1);
        var cmd = this.graphics.lineTo(x1, y1).command;
        createjs.Tween.get(cmd,{loop: true})
        .wait(i*10)
        .to({x:x2+Math.random(), y:y2+Math.random()}, 4000, createjs.Ease.cubicOut)
        .wait(2000+i*10)
        .to({x:x1, y:y1}, 4000, createjs.Ease.cubicInOut)
        this.on('tick', this.update, this);
      }
      update() {
      }
    }

    class Curve extends createjs.Container {
      constructor(x, y, rad, reflect, count, color) {
        super();
        this.x = x*radian+radian;
        this.y = y*radian+radian;
        this.regX = radian*2;
        this.regY = radian*2;
        this.rotation = rad;
        this.scaleX *= reflect;

        for(var i = 0; i < 180; i++){
          var x1 = radian/1.2*Math.sin(i*180/90*Math.PI/180)+radian;
          var y1 = radian/1.2*Math.cos(i*180/90*Math.PI/180)+radian;
          var x2 = radian/3*Math.sin((i+count)*180/45*Math.PI/180)+radian*3;
          var y2 = radian/3*Math.cos((i+count)*180/45*Math.PI/180)+radian*3;
          var x3 = radian/3*Math.sin(((i+90)+count)*180/90*Math.PI/180)+radian*3;
          var y3 = radian/3*Math.cos(((i+90)+count)*180/90*Math.PI/180)+radian*3;
          var line_inst  = new Line(x1, y1, x2, y2, x3, y3, i, color);
          this.addChild(line_inst);
        }
      }
    }

    class Curves extends createjs.Container {
      constructor(reflect) {
        super();
        // this.x = window.innerWidth/2 - window.innerWidth/4;
        // this.y = window.innerHeight/2 - window.innerHeight/4;
        var white = "#FFF";
        var black = "#333";
        for(var i=0; i<8; i++){
          for(var j = 0; j < 5; j++){
            random = Math.floor( Math.random() * (max - min + 1) )
            if (random % 2 == 0) {
              var curve1 = new Curve(i*2, j*2, 90*(i+j), reflect, 60*random, white);
            }else{
              var curve1 = new Curve(i*2, j*2, 90*(i+j), reflect, 120*random, black);
            }


            this.addChild(curve1);
          }
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