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
      if (scroll > elemPos - windowHeight + 200){
          $(this).addClass('scrollin');
      }
    });
  });

});
