$(document).ready(function(){
   

    $(document).on('click', '.search-icon', function () {
      $(this).parent(".search-wrapper").toggleClass("active");
    });

    // $('.menu-item ul li a').each(function () {
    //     $('.menu-item ul li').removeClass('current-item');
    //       $(this).parents("li").addClass('current-item');
    //   });

    $(document).on('click', '.menu-item ul li a', function () {
      $('.menu-item ul  li').removeClass('current-item');
      $(this).parents("li").addClass('current-item');
      $('.menu-item > ul  ul').hide();
      $(this).siblings('ul').slideDown();
    });

     

    // Published
    $(document).on('click', '.publsh-btn', function () {
      $(this).parents(".tab-card").toggleClass("published-wrap");
      $(this).toggleClass('active');
    })

    // popup start
   
      //$(document).on('click', '.fliter-btn', function () {
       // $('.search-wrapper').fadeIn('slow');
     //   return false;
     // })

     // $(document).on('click', '.close', function () {
     //   $('.search-wrapper').slideUp('slow');
        
     //   $('.search-wrapper').fadeOut('slow');
     //     return false;
    //  });


 // popup end

//  tab js
/*$('.tabs-nav li:first-child').addClass('active');
$('.tab-content').hide();
$('.tab-content:first').show();
// Click function
$(document).on('click', '.tabs-nav li', function () {
  $('.tabs-nav li').removeClass('active');
  $(this).addClass('active');
  $('.tab-content').hide();
  
  var activeTab = $(this).find('a').attr('href');
  $(activeTab).fadeIn();
  return false;
});*/

// Record page
$('.enterprise-wrp li a').click(function(){
  $('.enterprise-wrp li').removeClass('active');
  $(this).parent().addClass('active');

})

// accordion
$(document).on('click', '.accordion-wrp li a', function () {
  if ($(this).parent().hasClass("active")) {
    $(this).parent().removeClass("active");
    $(this).siblings(".content-box").slideUp(200);
  } else {
    $(".accordion-wrp li").removeClass("active");
    $(this).parent().addClass("active");
    $(".content-box").slideUp(200);
    $(this).siblings(".content-box").slideDown(200);
  }
});


// transcript js
$('.transcript-box a').click(function(){
  $(this).siblings().slideToggle();
})

$('.enterprise-box .btns-wrapper a').click(function(){
  $('.enterprise-box .btns-wrapper a').removeClass('active');
  $(this).addClass('active');
})

//.... strategy tab

//strategy page tabbing code
$(".tab-row li").click(function(){
  
var tab_id = $(this).attr('data-tab');

$(".tab-row li").removeClass('current');
$(".graph-col").removeClass('current');

$(this).addClass('current');
$("#"+tab_id).addClass('current');
})

// archive-tab


// massonary card

// ...mobile toggle menu
$('.mob-toggle a').click(function(){
  $(this).toggleClass('active');
  $('.mob-header').toggleClass('active')
  $('.left-header').addClass('active')
})
$('.close-menu').click(function(){
  $('.left-header').removeClass('active');
  $('.left-header').removeClass('active');
  $('.mob-toggle a').removeClass('active');
  $('.mob-header').removeClass('active')
})

$(document).on('click', '.search-icn', function () {
  $('.right-side-wrp form input').toggleClass('active');
});

 // $('#editor').richText();

  jQuery('#upfile, #upfile2').change(function() {
      var file = jQuery(this)[0].files[0].name;
      jQuery(this).parents('.file_upload').find('.doc_name').text(file);
  });


  $(document).on('click', '.header_links', function () {
    $('.acpopupmenu').toggleClass('active');
  });

});

