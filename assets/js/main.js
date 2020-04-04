$(function(){

  //modal
  $(".about").on("click", function(){
    $(".modal").addClass("active");
  });

  function closeModal(){
    $(".modal").removeClass("active");
  }

  $(".close, .modal").on("click", function(){
    closeModal();
  });

  $(document).keyup(function(e) {
    if (e.keyCode == 27) {
      closeModal();
    }
  });


  //fadein
  $(window).scroll(function (){
    $('.fadein').each(function(){
      var elemPos = $(this).offset().top;
      var scroll = $(window).scrollTop();
      var windowHeight = $(window).height();
      //canvasの透明度変化
      $('#myCanvas').css('opacity',1-scroll*0.001+'');
      // $('.header').css('opacity',1-scroll*0.001+'');
      // $('.footer').css('opacity',1-scroll*0.001+'');
      // $('.about').css('opacity',1-scroll*0.001+'');
      $('.scroll').css('opacity',1-scroll*0.001+'');

      //フェードインアニメーション発火
      if (scroll > elemPos - windowHeight){
          $(this).addClass('scrollin');
          // $('.scroll').css('right', -12-scroll*0.01+''+'rem');
      }
    });
  });

});
