window.addEventListener('load', init);
    var curves, w, h, centerX, centerY;
    var curveList = [];
    var curveListB = [];
    var stage;
    var size = window.innerHeight/4.75 ;

    function init() {
      stage = new createjs.Stage('myCanvas');

      for(var i = 8; i < 15; i++){
        var curves = new Rings();
        curves.x = window.innerWidth/2;
        curves.y = window.innerHeight/2;
        if(i < 8){
          //curves.scaleX = curves.scaleY = 1/Math.pow(2,i);
        }else if(i == 8){
          curves.scaleX = curves.scaleY = 1;
        }else if(i > 8){
          curves.scaleX = curves.scaleY = 1*Math.pow(2,i-8);
        }
        curveList[i] = curves;
        stage.addChild(curves)
      }

      createjs.Ticker.addEventListener("tick", stage);
      createjs.Ticker.timingMode = createjs.Ticker.RAF;
      window.addEventListener("resize", function(){
        handleResize(curves);
      }, false);
      handleResize();
      stage.update();

    }


    //mainRing部分----------

    class Rings extends createjs.Container {
      constructor(scale) {
        super();
        for (var i = 0; i < 6; i++) {
          var cellRings = new DobuleCells();
          cellRings.regY = window.innerHeight/2;
          cellRings.rotation = 30*i;
          this.addChild(cellRings);
        }
        for (var i = 0; i < 6; i++) {
          var cellRings = new DobuleCells();
          cellRings.regY = window.innerHeight/2;
          cellRings.rotation = 30*i+15;
          cellRings.scaleX = 0.7055;
          cellRings.scaleY = 0.7055;
          this.addChild(cellRings);
        }
      }
    }

    class DobuleCells extends createjs.Container {
      constructor() {
        super();
        for(var i = 0; i< 2; i++){
          var doubleCells = new Cells();
          doubleCells.rotation = 45;
          doubleCells.y = window.innerHeight*i-size*i;
          this.addChild(doubleCells);
        }
      }
    }

    class Cells extends createjs.Container {
      constructor() {
        super();
        var lineNum = 100;
        var linesA = new Lines(size, lineNum);
        this.addChild(linesA);
        var linesB = new Lines(size, lineNum);
        linesB.regX = size/Math.SQRT2;
        linesB.regY = size/Math.SQRT2;
        linesB.rotation = 180;
        this.addChild(linesB);
      }
    }

    class Lines extends createjs.Shape {
      constructor(size, lineNum) {
        super();
        this.graphics
          .beginStroke("#FFF")
          .setStrokeStyle(0.3);
        for(var i = 0; i < lineNum+1; i++){
          this.graphics.moveTo(0, size/Math.SQRT2/lineNum*i);
          var cmd = this.graphics.lineTo(0, size/Math.SQRT2/lineNum*i).command;
          createjs.Tween.get(cmd, {loop: false})
            .wait(1000)
            .to({x:(size*2/Math.SQRT2)/lineNum*i, y:(size*2)/Math.SQRT2},
           300*i,
           createjs.Ease.bounceOut)
          this.on('tick',this.update, this);
        }
      }
      update() {

      }
    }

    function handleResize(curves) {
      // 画面幅・高さを取得
      w = window.innerWidth;
      h = window.innerHeight;
      // Canvas要素の大きさを画面幅・高さに合わせる
      stage.canvas.width = w;
      stage.canvas.height = h;
      for (var i = 1; i < curveList.length; i++) {
        curveList[i].x = w/2;
        curveList[i].y = h/2;
      }
      // 画面更新する
      stage.update();
    }