var stage;
var obj1;
var BG;
var array = [];
var angle = 0;
var text;
var random = 0;

window.addEventListener('load', init);
window.addEventListener('load', handleResize);//ロード時リサイズをかける

var FizzyText = function() {
    this.maxAlpha = 0.55;
    this.minAlpha = 0.1;
    this.tileNum = 1;
    this.color0 = "#e63352";
};

window.onload = function() {
    text = new FizzyText();
    init();
    var gui = new dat.GUI();
    gui.add(text, 'maxAlpha', 0, 1).step(0.05).onChange(init);
    gui.add(text, 'minAlpha', 0, 1).step(0.05).onChange(init);
    gui.add(text, 'tileNum', 0, 1).step(0.05).onChange(init);
    gui.addColor(text, 'color0').onChange(init);
};

function init() {

    stage = new createjs.Stage("myCanvas");
    for(var j = 0; j < 64; j++){
        array[j] = [];
        for(var i = 0; i < 48; i++){
            random = Math.random();
            if(random < text.tileNum){
                drawShape(89.81/2*j-50,89.81/2*i - 50);
                array[j][i] = obj1;
                stage.addChild(obj1);
            }

        }
    }
    window.addEventListener("resize", function(){
      handleResize();
    });



    stage.update();
}

function drawShape(x,y){
    obj1 = new createjs.Shape();
    obj1.graphics.beginFill(text.color0);
    obj1.graphics.moveTo(186.416,68.678);
    obj1.graphics.lineTo(185.834,66.507);
    obj1.graphics.lineTo(176.11,30.216);
    obj1.graphics.lineTo(137.648,19.91);
    obj1.graphics.lineTo(103.163,0);
    obj1.graphics.lineTo(68.678,19.91);
    obj1.graphics.lineTo(30.216,30.216);
    obj1.graphics.lineTo(19.91,68.678);
    obj1.graphics.lineTo(0,103.163);
    obj1.graphics.lineTo(19.91,137.647);
    obj1.graphics.lineTo(30.216,176.11);
    obj1.graphics.lineTo(68.678,186.416);
    obj1.graphics.lineTo(103.163,206.326);
    obj1.graphics.lineTo(137.648,186.416);
    obj1.graphics.lineTo(176.11,176.11);
    obj1.graphics.lineTo(186.416,137.647);
    obj1.graphics.lineTo(206.326,103.163);
    obj1.graphics.lineTo(186.416,68.678);
    obj1.cache(0, 0, 206.326, 206.326);
    obj1.scaleX = 0.5;
    obj1.scaleY = 0.5;
    obj1.alpha = Math.random() * (text.maxAlpha - text.minAlpha) - text.minAlpha;
    obj1.x = x;
    obj1.y = y;
}

function handleResize() {
   var w = window.innerWidth;
   var h = window.innerHeight;
   stage.canvas.width = w;
   stage.canvas.height = h;
   stage.update();
 }
