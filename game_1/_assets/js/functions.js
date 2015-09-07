/* global vars */
var game_data = "";
/* */

/* window/document states */
$(window).ready(function() {
	init();
	//$("polygon").mouseover(function(e) { var pos = $(this).position(); var width = $(this).outerWidth(); $("#tools").removeClass("hidden").css({top: pos.top + "px", left: (pos.left + width) + "px" }); });
	setTimeout(function() { $("#loader").fadeOut(500, function() { $(this).remove(); }); }, 500);			
});
/* */

/* game functions */
function init() {	
	$.getJSON("data.json", function(data) { game_data = data; }).complete(function() {
		console.log(game_data.buildings_and_tools);
		goto_screen("game");
	});
}

function goto_screen(which) {
	if ($("#" + which).hasClass("hidden")) $("#" + which).removeClass("hidden");
	$(".screen").each(function() { if ($(this).attr("id") != which) $(this).addClass("hidden"); });
}

function remove_svg_area(which_area, which_tool) {
	var id = which_area.id.split("_");
	$("#" + id[0] + "_" + id[1] + "_hover").unbind('mouseenter mouseleave').attr("style", "fill:#0c0;").fadeOut(100).fadeIn(500).fadeOut(100);
	$("#" + id[0] + "_" + id[1] + "_group").remove();
}
/* */