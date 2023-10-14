$('#mySidenav').hide();
$( "#menu_toggle_btn" ).on( "click", function() {
	$('#mySidenav').toggle();	
	/* $('#logo_mobile').toggle();	 */
	/* $('.right-inner-addon input ').css("width",'100%');
	$('.navbar-toggle').css("margin-left",'0%');
	$('.right-inner-addon img ').css("right",'1%'); */
});

function toggleIcon(e) {
    $(e.target)
        .prev('.panel-heading')
        .find(".more-less")
        .toggleClass('glyphicon-plus glyphicon-minus');
}
$('.panel-group').on('hidden.bs.collapse', toggleIcon);
$('.panel-group').on('shown.bs.collapse', toggleIcon);

$('.responsive-tabs').responsiveTabs({
  accordionOn: ['xs', 'sm']
});

$(window).load(function(){
	$(document).ready(function(e) {
		$(".vertical-scroll").mCustomScrollbar({scrollButtons:{enable:true},theme:"dark-3"});
    });
});

$(document).ready(function() {
	
	$( document ).on( "click", "#show_account_link", function() {
		$(".acpopupmenu").show();
	});
	$( document ).on( "click", "body", function() {
		//if(!$('#show_account_link').is(":hover") && !$('.acpopupmenu').is(":hover")){
			$(".acpopupmenu").hide();
		//}
	});


});

$('#mySidenav').hide();
$( "#menu_toggle_btn" ).on( "click", function() {
	$('#mySidenav').toggle();	
});

$('.mobile-toggle').click(function() {
	$('.mobile-toggle').parent().children('.collapse').collapse('hide');
	$(this).next().collapse('show');
});

$(window).load(function() {
	height = $(".profie_cal_image").height();
	height1 = height-25;
	
	$('.movecal_he').css('margin-top',height1/2);

	
	$('body').css('opacity','1');
});