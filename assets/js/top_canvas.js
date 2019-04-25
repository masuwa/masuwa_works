window.addEventListener('load', init);

var radian = 100;
var curves, w, h, centerX, centerY;
var stage;
function init() {

  createCanvas();
  stage = new createjs.Stage('myCanvas');
  curves = new Curves();
  curves.x = window.innerWidth/2;
  curves.y = window.innerHeight/2;
  stage.addChild(curves);
  createjs.Ticker.addEventListener("tick", stage);
  createjs.Ticker.timingMode = createjs.Ticker.RAF;
  window.addEventListener("resize", function(){
    handleResize(curves);
  }, false);
  handleResize();
  stage.update();

}

function createCanvas(){
  //canvasの生成
  var div = document.createElement('div');
  div.setAttribute("class", "canvas");
  var canvas = document.createElement("canvas");
  canvas.setAttribute("id", "myCanvas");
  div.appendChild(canvas)
  document.body.insertBefore(div,document.body.firstChild);
  var myCanvas = document.getElementById('myCanvas');
  myCanvas.style.width = "100%";
  myCanvas.style.height = "100%";
  myCanvas.style.display = "block";
  myCanvas.style.backgroundColor = "#FFF";
  myCanvas.style.position = "fixed";
  myCanvas.style.top = "0";
  myCanvas.style.left = "0";
}

//線の座標クラス
class Line extends createjs.Shape {
  constructor(x1, y1, x2, y2, x3, y3, i, color) {
    super();

    if(navigator.userAgent.match(/(iPhone|iPad|iPod|Android)/i)){
      this.graphics.beginStroke(color).setStrokeStyle(0.1).moveTo(x1,y1);
      this.alpha = .1;
    }else{
      this.graphics.beginStroke(color).setStrokeStyle(0.1).moveTo(x1,y1);
    }
    var cmd = this.graphics.lineTo(x1, y1).command;
    createjs.Tween.get(cmd, {loop: true})
    .to({x:x2, y:y2},4000, createjs.Ease.cubicInOut)
    .to({x:x3, y:y3}, 4000, createjs.Ease.cubicInOut)
    .to({x:x2, y:y2}, 4000, createjs.Ease.cubicInOut)
    .to({x:x3, y:y2}, 4000, createjs.Ease.cubicInOut)
    .to({x:x2, y:y2}, 4000, createjs.Ease.cubicInOut)
    .to({x:x1, y:y1}, 4000, createjs.Ease.cubicInOut)
    this.on('tick', this.update, this);
  }
  update() {

  }
}

class Curve extends createjs.Container {
  constructor(x, y, rad, reflect, count, color) {
    super();
    this.x = x*radian-radian*2;
    this.y = y*radian-radian*2;
    this.regX = radian*2;
    this.regY = radian*2;
    this.rotation = rad;
    this.scaleX *= reflect;

    for(var i = 0; i < 180; i++){
      var x1 = radian*Math.sin(i*180/90*Math.PI/90)+radian;
      var y1 = radian*Math.cos(i*180/90*Math.PI/90)+radian;
      var x2 = radian/2*Math.sin((i+count)*180/45*Math.PI/90)+radian*3;
      var y2 = radian/2*Math.cos((i+count)*180/90*Math.PI/90)+radian*3;
      var x3 = radian/2*Math.sin(((i+45)+count)*180/45*Math.PI/90)+radian*3;
      var y3 = radian/2*Math.cos(((i+45)+count)*180/90*Math.PI/90)+radian*3;
      var line_inst  = new Line(x1, y1, x2, y2, x3, y3, i, color);
      this.addChild(line_inst);

    }
  }
  update() {

  }
}

class Curves extends createjs.Container {
  constructor() {
    super();
    var white = "#333";
    var ac_color = "#333";
    this.scaleX = this.scaleY = 1;

    var curve1_1 = new Curve(0, 0, 0, -1, 20, white);
    this.addChild(curve1_1);
    var curve1_2 = new Curve(0, 2, 180, 1, 12, ac_color);
    this.addChild(curve1_2);
    var curve1_3 = new Curve(2, -2, 180, -1, 52, white);
    this.addChild(curve1_3);
    var curve1_4 = new Curve(4, -2, 180, 1, 82, ac_color);
    this.addChild(curve1_4);
    var curve1_5 = new Curve(6, 0, 0, 1, 42, white);
    this.addChild(curve1_5);

    var curve2_1 = new Curve(0, 4, -90, -1, 62, white);
    this.addChild(curve2_1);
    var curve2_2 = new Curve(2, 4, 90, 1, 22, ac_color);
    this.addChild(curve2_2);
    var curve2_3 = new Curve(-2, 2, 90, -1, 92, white);
    this.addChild(curve2_3);
    var curve2_4 = new Curve(-2, 0, 90, 1, 42, white);
    this.addChild(curve2_4);
    var curve2_5 = new Curve(0, -2, 270, 1, 12, white);
    this.addChild(curve2_5);

    var curve3_1 = new Curve(4, 4, -180, -1, 62, white);
    this.addChild(curve3_1);
    var curve3_2 = new Curve(4, 2, 0, 1, 22, white);
    this.addChild(curve3_2);
    var curve3_3 = new Curve(2, 6, 0, -1, 29, white);
    this.addChild(curve3_3);
    var curve3_4 = new Curve(0, 6, 0, 1, 21, white);
    this.addChild(curve3_4);
    var curve3_5 = new Curve(-2, 4, 180, 1, 100, white);
    this.addChild(curve3_5);

    var curve4_1 = new Curve(4, 0, -270, -1, 2, ac_color);
    this.addChild(curve4_1);
    var curve4_2 = new Curve(2, 0, -90, 1, 10, white);
    this.addChild(curve4_2);
    var curve4_3 = new Curve(6, 2, -90, -1, 40, white);
    this.addChild(curve4_3);
    var curve4_4 = new Curve(6, 4, -90, 1, 140, white);
    this.addChild(curve4_4);
    var curve4_5 = new Curve(4, 6, -270, 1, 60, white);
    this.addChild(curve4_5);
    this.on('tick', this.update, this);
  }
  update() {
    if (window.innerWidth > 768) {
      this.scaleX = this.scaleY = window.innerWidth/1200;
    }else{
      this.scaleX = this.scaleY = window.innerWidth/600;
    }

  }
}

function handleResize(curves) {

  // 画面幅・高さを取得
  w = window.innerWidth;
  h = window.innerHeight;
  // Canvas要素の大きさを画面幅・高さに合わせる
  stage.canvas.width = w;
  stage.canvas.height = h;
  curves.x = w/2;
  curves.y = h/2;

  // 画面更新する
  stage.update();
}
