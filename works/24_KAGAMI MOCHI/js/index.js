window.addEventListener( "load", init ) ;
function init(){
  var div;
  var start = null;
  var illustList = [];

  var contents = document.getElementById('contents')

  for (var j = 0; j < 6; j++) {
    illustList[j] = [];
    for (var i = 0; i < 10; i++) {
      div = document.createElement('div');
      div.classList.add('illust');
      contents.appendChild(div);

      var sense = document.createElement('img');
      sense.src = 'img/sensu.png';
      var motchi = document.createElement('img');
      motchi.src = 'img/motchi.png'
      var mikan = document.createElement('img');
      mikan.src = 'img/mikan.png';

      div.appendChild(sense);
      div.appendChild(motchi);
      div.appendChild(mikan);

      div.style.top = (150 * j - 125) + "" + "px";
      div.style.left = (250 * i - 125*j) + "" + "px";

      illustList[j][i] = div;
    }

  }

  tick();
  function tick(timestamp) {
    if (!start) start = timestamp;
    var currentTime = new Date().getTime();　//経過時刻を取得
    var status = (start - currentTime) // 描画開始時刻から経過時刻を引く

    for (var j = 0; j < 6; j++) {
      for (var i = 0; i < 10; i++) {
        illustList[j][i].children[0].style.transform =  "translateY(" + Math.abs(Math.cos(status*0.005+i))*-50 +""+ "px)";
        illustList[j][i].children[1].style.transform = "translateX(" + Math.cos(status*0.005+i*j)*20 +""+ "px)" + "translateY(" + Math.cos(status*0.005+i*j)*-10 +""+ "px)";
        illustList[j][i].children[2].style.transform = "translateX(" + Math.sin(status*0.005+i*j)*40+1 +""+ "px)" + "translateY(" + Math.sin(status*0.005+i*j)*20+1 +""+ "px)";
      }
    }
    window.requestAnimationFrame(tick);
  }

}

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
