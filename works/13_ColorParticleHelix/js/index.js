var w, h, max, min;
var maxDots=600;
var delta = 0;
var shape;

window.addEventListener('load', init);
function init(){
	var stage = new createjs.Stage("myCanvas")
	var dotTemplate, dots=[];

	while (dots.length < maxDots) {
		var dot4 = new Dots(dotTemplate, dots, "#ffffff", 15);
		stage.addChild(dot4);
		var dot3 = new Dots(dotTemplate, dots, "#ffbf00", 5);
		stage.addChild(dot3);
		var dot2 = new Dots(dotTemplate, dots, "#ff00bc", 15);
		stage.addChild(dot2);
		var dot = new Dots(dotTemplate, dots, "#2de6ff", 10);
		stage.addChild(dot);



	}

	createjs.Ticker.timingMode = createjs.Ticker.RAF;
	createjs.Ticker.on("tick", tick);
	function tick(evt) {
		delta = evt.delta;
		dot.update(dots, .1, .5);
		dot2.update(dots, .1, 1);//update(dots,amp1Amt,speed)
		dot3.update(dots, .1, 2);
		dot4.update(dots, 2, 2);
		stage.update();
	}

	window.addEventListener("resize", function(){
		onResize(stage);
	});
	onResize(stage);

}

class Dots extends createjs.Container {
	constructor(dotTemplate, dots, color, dotR) {
		super();
			if (!dotTemplate) {
				var dotShape = new createjs.Shape();
				dotShape.graphics
					.beginFill(color)
					.drawCircle(0,0,dotR);
				var pow = Math.ceil(Math.log(dotR)/Math.log(2)), base2R = Math.pow(2,pow);
				dotShape.cache(-base2R,-base2R,base2R*2,base2R*2);
				dotTemplate = new createjs.Bitmap(dotShape.cacheCanvas);
			}
			this.alpha = 1;
			this.addChild(dotTemplate.clone());
			this.t = this.random(Math.PI);
			this.speed = Math.pow(this.random(0.5,1),3);
			this.size = 1-this.speed;
			this.a1 = this.random(0,0.7)*this.random(0,this.speed)*(this.random(1)<0.5?-1:1);
			this.r = this.random(0.5,1);
			this.p1 = this.random(0.3,0.7);
			dots.push(this);
	}

	update(dots,amp1Amt,speed) {
		var fov = min*1;
		for (var i=0, l=dots.length; i<l; i++) {
			var t = (dots[i].t += delta*0.0001*speed*dots[i].speed);
			var x = t%1*w-w/2;
			x += Math.cos(t*dots[i].p1)*min*dots[i].a1*amp1Amt;
			var y = Math.sin(t*Math.PI*2+Math.PI)*min*dots[i].r*0.3;
			y += Math.sin(t*dots[i].p1)*min*dots[i].a1*amp1Amt;
			var z = Math.cos(t*Math.PI*2+Math.PI)*min*dots[i].r*0.25;
			z += Math.cos(t*dots[i].p1)*min*dots[i].a1*amp1Amt;
			var s = fov/(z+fov);
			x *= s;
			y *= s;
			dots[i].x = x+w/2;
			dots[i].y = y+h/2;
			dots[i].scaleX = dots[i].scaleY = Math.pow(s*(1+dots[i].size),2)*0.3;
		}
	}

	random(min, max) {
		if (max === undefined) { max=min; min=0; }
		return Math.random()*(max-min)+min;
	}

}


function onResize(stage) {
	w = window.innerWidth
	h = window.innerHeight;
	max = Math.max(w,h);
	min = Math.min(w,h);
	stage.canvas.width = w;
	stage.canvas.height = h;

	stage.updateViewport(w,h);
	stage.update();
}