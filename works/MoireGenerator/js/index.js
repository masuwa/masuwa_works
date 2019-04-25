var stage;
var container;
var container2;
var text;
var rad;
var moire, moire2, cirX, cirY, lastX, lastY;
var moires = [];
var speed1, speed2;
var count = 0;

var FizzyText = function() {
	this.lineNum = 360;
	this.px = 2;
	this.py = 3;
	this.radianX = 10;
	this.radianY = 10;
	this.speed1 = 1;
	this.speed2 = 1;
};

window.addEventListener('load', init);
window.addEventListener('load', handleResize);//ロード時リサイズをかける

window.onload = function() {
	text = new FizzyText();
	init();
	var gui = new dat.GUI();
	gui.add(text, 'lineNum', 0, 360).step(10).onChange(init);
	gui.add(text, 'px', 1, 10).step(1).onChange(init);
	gui.add(text, 'py', 1, 10).step(1).onChange(init);
	gui.add(text, 'radianX', 0, 50).step(1).onChange(init);
	gui.add(text, 'radianY', 0, 50).step(1).onChange(init);
	gui.add(text, 'speed1', 0, 1).onChange(init);
	gui.add(text, 'speed2', 0, 1).onChange(init);
};

function init() {

	// Stageの作成
	stage = new createjs.Stage("myCanvas");

	container = new createjs.Container();
	container.x = stage.canvas.width/2;
	container.y = stage.canvas.height/2;
	stage.addChild(container); // 画面に追加

	container2 = new createjs.Container();
	container2.x = stage.canvas.width/2;
	container2.y = stage.canvas.height/2;
	stage.addChild(container2); // 画面に追加

	rad = text.lineNum;//線の数

	for (var i = 1; i < 361; i++) {
		cirX = 1000*Math.cos(i*360/rad*Math.PI/180);
		cirY = 1000*Math.sin(i*360/rad*Math.PI/180);
		lastX = text.radianX*Math.cos(i*360/rad*Math.PI/180*text.px);
		lastY = text.radianY*Math.sin(i*360/rad*Math.PI/180*text.py);
		for(var j = 0; j < 2; j++){
			drawMoire(j);
			if(j==0){
				container.addChild(moire);
			}else{
				container2.addChild(moire);
			}
		}
	}

	window.addEventListener("resize", function(){
		handleResize();
	});

	createjs.Ticker.setFPS(30);
	createjs.Ticker.addEventListener("tick", handleTick);
}

function drawMoire(i){
	count += 1;
	moire = new createjs.Shape();
	moire.graphics
		.beginStroke(createjs.Graphics.getHSL(0, 0, 0))
		.setStrokeStyle(1)
		.moveTo(cirX, cirY)
		.lineTo(lastX, lastY);
	moire.alpha = 0.9;
	moire.x = stage.canvas.width;
	moire.y = stage.canvas.height;
	moire.regX = stage.canvas.width;
	moire.regY = stage.canvas.height;
	moires[i] = moire;
}

function handleTick() {
	container.rotation += text.speed1;
	container2.rotation -= text.speed2;
	stage.update();
}

function handleResize() {
	 var w = window.innerWidth;
	 var h = window.innerHeight;
	 stage.canvas.width = w;
	 stage.canvas.height = h;
	 container.x = stage.canvas.width/2;
	 container.y = stage.canvas.height/2;
	 container2.x = stage.canvas.width/2;
	 container2.y = stage.canvas.height/2;
	 stage.update();
}
