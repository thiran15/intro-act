const btn = document.getElementById('menu-btn')
const nav = document.getElementById('menu')
const mblBtn = document.getElementsByClassName('hasMobileMenu')
const mblmenuWrapper = document.getElementsByClassName('hasMobileMenu')

$(document).ready(function(){

  $(document).on('click', '#menu-btn', function () {
    $("#menu-btn").toggleClass("open");
    $("#menu").toggleClass("flex");
    $("#menu").toggleClass("animationCustom");
    //btn.classList.toggle('open')
    //nav.classList.toggle('flex')
    //nav.classList.toggle('animationCustom')
    //nav.classList.toggle('hidden')
  });

  $(document).on('click', '.hasMobileMenu', function (e) {
    e.preventDefault();            

    $(".hasMobileMenu").toggleClass("show");
    $(".mbl-submenu").toggleClass("animationCustom");
    $(".hasMobileMenu span").toggleClass("collapsed");
    //btn.classList.toggle('open')
    //nav.classList.toggle('flex')
    //nav.classList.toggle('animationCustom')
    //nav.classList.toggle('hidden')
  });
 
});


var mblsebmenuItems = document.querySelector(".mbl-submenu");
var mblSubMenus= document.querySelector(".hasMobileMenu");  
/*mblSubMenus.addEventListener("click", function (e) {
    e.preventDefault();                           
    mblSubMenus.classList.toggle("show");
    //mblsebmenuItems.classList.toggle("hidden");
    mblsebmenuItems.classList.toggle('animationCustom')
    mblSubMenus.querySelector('span').classList.toggle("collapsed");
});*/


// var mblsebmenuItems2 = document.querySelector(".mbl-submenu2");
// var mblSubMenus2= document.querySelector(".hasMobileMenu2");  
// mblSubMenus2.addEventListener("click", function (e) {
//     e.preventDefault();                           
//     mblSubMenus2.classList.toggle("show");
//     //mblsebmenuItems.classList.toggle("hidden");
//     mblsebmenuItems2.classList.toggle('animationCustom')
//     mblSubMenus2.querySelector('span').classList.toggle("collapsed");
// });



$(".dropdown dt > a").on('click', function() {
  $(".dropdown dd ul").slideToggle('fast');
});

$(".dropdown dd ul li > a").on('click', function() {
  $(".dropdown dd ul").hide();
});

function getSelectedValue(id) {
  return $("#" + id).find("dt a span.value").html();
}

$(document).bind('click', function(e) {
  var $clicked = $(e.target);
  if (!$clicked.parents().hasClass("dropdown"))
  { 
      $(".dropdown dd ul").hide();
  }
});

$('.mutliSelect input[type="checkbox"]').on('click', function() {

  var title = $(this).closest('.mutliSelect').find('input[type="checkbox"]').val(),
    title = $(this).val();

    var itemCount = $('.mutliSelect input[type="checkbox"]:checked').length;
    if (itemCount == 0)
    {
      $('.multiSel').empty();
      $('span[title="' + title + '"]').remove();
      var ret = $(".hida");
      $('.dropdown dt > a').append(ret);
    }
    else if (itemCount == 1)
    {
      $('.multiSel').empty();
      var html = $('.mutliSelect input[type="checkbox"]:checked').val();
         $('.multiSel').append(html);
         $(".hida").hide();
    }
    else
    {
      $('.multiSel').html(itemCount + " items selected");
      $(".hida").hide();
    }

  if($(this).closest('.mutliSelect').find('input[type="checkbox"]:checked').length == 0)
  {
    $(".hida").show();
  } 

  
});


// $('.registration-form').addClass('hidden');
// $('#registeredBtn').click(function(){
//     $('.login-form').addClass('hidden');
//     $('.registration-form').removeClass('hidden');
// });

$('.loginmainBtn').click(function(){
  $('.login-form').removeClass('hidden');
  //$('.registration-form').addClass('hidden');
});
$('#loginBtn').click(function(){
  $('.login-form').removeClass('hidden');
  //$('.registration-form').toggleClass('hidden');
});

$('.exit-overlay').click(function(){
  $('.login-form').removeClass('hidden');
  //$('.registration-form').toggleClass('hidden');
});


$( document ).ready(function() {
	$(".filter a").click(function() {
		event.preventDefault();
	    $("html, body").animate({ scrollTop: $($(this).attr('href')).offset().top - 60 }, 500);
	    return true;
	});
});


$('#technologyTab > li > button').click(function(){
    $('#technologyTab > li > button').removeClass('activeTab');
    $(this).addClass('activeTab');  
});


$(document).mouseup(function(e) 
{
    var container = $(".filterDropdown ");
    if (!container.is(e.target) && container.has(e.target).length === 0) 
    {
        $('.filterDropsown-submenu').removeClass('activeFilterdd');
    }
});

$('.filterDropdown .filterdd-btn').click(function(){
  $(this).next('.filterDropsown-submenu').toggleClass('activeFilterdd');
  $(this).toggleClass('mobilefilterBtn');
});


$('.showmorelesser').click(function(e){
  e.preventDefault();
  $(this).parent('.showmoreless-content').find('.visible-showmore').toggleClass('visible-always',50);
  $(this).toggleClass('showml-active');
  $(this).children('span').text(function(i, text){
    return text === "Show less" ? "Show all" : "Show less";
  });
});



$('.df-filterDropdown').click(function(){
    $('.df-sidebarfilter').toggleClass('mobileShowdf');
    $('.df-overlay').toggleClass('showdf');
});

$('.df-overlay').click(function(){
  $('.df-sidebarfilter').toggleClass('mobileShowdf');
  $('.df-overlay').toggleClass('showdf');
});


$(".radio-dropdown dd .custom-radioButton-drp").hide();
$(".radio-dropdown dt > a").on('click', function() {
  $(".radio-dropdown dd .custom-radioButton-drp").slideToggle('fast');
});

$(".radio-dropdown dd ul li > a").on('click', function() {
  $(".radio-dropdown dd .custom-radioButton-drp").hide();
});

$(document).bind('click', function(e) {
  var $clicked = $(e.target);
  if (!$clicked.parents().hasClass("radio-dropdown"))
  { 
      $(".radio-dropdown dd .custom-radioButton-drp").hide();
  }
});

$('.custom-radioButton-drp input[name="categories"]').click(function(){
  $('.radioCustSelect').empty();
    var getCatVal= $(this).val();
    $('.radioCustSelect').append('<span>'+getCatVal+'</span>');
    $('.radioCustSelect').append('<i class="float-right customRadioClose"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg></i>')
    $('.hideDefault').hide();
});

$(document).on('click','.customRadioClose',function(e) {
  $('.hideDefault').show();
  $('.radioCustSelect').empty();
});