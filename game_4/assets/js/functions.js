/* global vars */
var isIE = $.browser.msie; var isIE8 = $.browser.msie && ($.browser.version.indexOf(8) != -1); var isIE9 = $.browser.msie && ($.browser.version.indexOf(9) != -1);
var isMobile = false; if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;
var touch = ('ontouchstart' in document.documentElement);
var lang = ((getUrlParam("lang") == "gr" || !getUrlParam("lang")) ? "gr" : "en");
var game_data = "";
var total_seconds = 120;
var timer_interval = null;
var current_level = 0;
var game_is_running = false;
/* */


/* window/document states */
$(window).load(function() {
	if (isIE8 || isIE9) {
		$("body").html("<div style='width:1024px; text-align:center; margin:25px auto;'>This site uses web technologies that your browser (Internet Explorer " + $.browser.version + ") doesn't support.<br/>Please visit the site using a new version of <a href='https://www.google.com/intl/en/chrome/browser/'>Google Chrome</a>, <a href='http://www.mozilla.org/en-US/firefox/new/'>Mozilla Firefox</a>, <a href='https://www.apple.com/safari/'>Safari</a> or <a href='http://www.opera.com/'>Opera</a>.<br/>Sorry for the inconvenience :-/</div>");
	} else {
		init();
		$("#container").attr("lang",lang);
		$("*[theTitle]").titlesBehaviour();	
		$("#start_game").click(function() { goto_screen("level_1"); });
		$("#enter_game").click(function() { $("#intro").addClass("instructions"); });
		$("#help").click(function() { show_help(); });
		$("#close_help").click(function(event) { hide_help(); event.stopPropagation(); });
		$("#close_message").click(function(event) { hide_message(); event.stopPropagation(); });	
		$(".figure").draggable({revert: false, start: function() { $(this).css({"z-index":4000}); $(this).data("parent_id",$(this).parent().attr("id")); }, stop: function() { $(this).css({"z-index":200}); } }).click(function() { remove_figure($(this).attr("id")); });
		$(".position").droppable({drop: function(event,ui) { var position_id = $(this).attr("id"); drop_figure(event,$(ui.draggable).attr("id"),position_id); } });
		$(".vas, .figures").droppable({drop: function(event,ui) { if ($(this).hasClass("figures")) remove_figure($(ui.draggable).attr("id")); }});
		$(".vas_check_button").each(function() { $(this).click(function() { check_positions(); }); });
		$(".vas_hint").each(function() { $(this).bind("mousedown touchstart", function() { if (game_is_running) show_hint(); }).bind("mouseup touchend", function() { if (game_is_running) hide_hint(); }); });
		$(document).keyup(function(e) {
		  if (e.keyCode == 27 /* escape */ || e.keyCode == 13 /* enter */) { hide_help(); hide_message(); }
		}).mouseup(function() { hide_hint(); });
		if (touch) { disableHover(); window.scrollTo(0,1); }
		setTimeout(function() { $("#loader").fadeOut(500, function() { $(this).remove(); }); }, 500);
	}
});
/* */


/* game functions */
function init() {	
	$.getJSON("data.json", function(data) { game_data = data; }).complete(function() {
		$("head title").html(eval("game_data.texts." + lang + ".game_title"));
		$("#game_title").attr("src","assets/img/game_4_title_" + lang + ".svg");
		$("#game_subtitle").html(eval("game_data.texts." + lang + ".intro"));
		$("#enter_game").html(eval("game_data.texts." + lang + ".enter_game_button"));
		$("#start_game").html(eval("game_data.texts." + lang + ".start_game_button"));		
		$("#help_text").html(eval("game_data.texts." + lang + ".help_text"));
		$("#intro").removeClass("instructions");
		$(".vas_check_button").html(eval("game_data.texts." + lang + ".check_button"));
		$(".vas_hint").html(eval("game_data.texts." + lang + ".hint_button"));
		goto_screen("init");
	});
}

function goto_screen(which) {	
	if ($("#" + which).hasClass("hidden")) $("#" + which).removeClass("hidden");
	if (which.indexOf("level") != -1) {
		$("#help, #clock").removeClass("invisible");
		$("#" + which + "_vas_caption").html("");		
		current_level = which.split("_")[1];
		position_figures();
		add_figure_text();
		$("*[theTitle]").titlesBehaviour();
		$("#level_" + current_level + " .vas .empty_vas, #level_" + current_level + " .vas .position, #level_" + current_level + "_vas_hint, #level_" + current_level + "_vas_check_button").removeClass("invisible");		
		hide_help();
		reset_timer(); start_timer();
	}
	else { $("#help, #clock").addClass("invisible"); current_level = 0; }	
	$(".screen").each(function() { if ($(this).attr("id") != which) $(this).addClass("hidden"); });
}

function show_help() { pause_timer(); $("#help_icon").addClass("invisible").delay(100).queue(function() { $("#help").removeClass("hidden"); $(this).dequeue(); }).delay(100).queue(function() { $("#help_text").removeClass("invisible"); $("#close_help").removeClass("invisible"); $(this).dequeue(); }); }
function hide_help() { if (total_seconds != 0 && game_is_running) start_timer(); $("#help_text").addClass("invisible"); $("#close_help").addClass("invisible"); $("#help_icon").removeClass("invisible"); $("#help").addClass("hidden"); }

function show_message(params) {
	pause_timer();
	$("#message").html("").html(params.message + "<br/><br/>");
	$("#buttons").html(""); for (b = 0; b < params.buttons.length; b++) { $("#buttons").append("<div class='button' onclick='hide_message(); " + params.buttons[b].action.toString() + "'>" + params.buttons[b].button + "</div>"); }	
	$("#popup").removeClass("down").removeClass("invisible");
}
function hide_message(where) {
	if (total_seconds != 0 && game_is_running) start_timer();
	if (where == "down") { if (!$("#popup").hasClass("down")) $("#popup").addClass("down"); else $("#popup").removeClass("down"); }
	else $("#popup").addClass("invisible");
}

function start_timer() { timer_interval = setInterval(clock_timer,1000); game_is_running = true; $(".figure").draggable("enable"); }
function clock_timer() { total_seconds--; var minutes = parseInt(total_seconds/60)%60; var seconds = total_seconds%60; $("#clock").html((minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds)); if (total_seconds < 11) $("#clock").addClass("last_ten"); else $("#clock").removeClass("last_ten"); if (total_seconds == 0) { stop_timer(); game_is_running = false; check_positions(current_level); } }
function pause_timer() { clearInterval(timer_interval); }
function stop_timer() { clearInterval(timer_interval); timer_interval = null; total_seconds = 0; $(".figure").draggable("disable"); }
function reset_timer() { total_seconds = 120; $("#clock").html("02:00").removeClass("last_ten"); }

function show_hint() { if (game_is_running && total_seconds > 4) { $("#level_" + current_level + " .vas .empty_vas, #level_" + current_level + " .vas .position, #level_" + current_level + " .figure").addClass("invisible"); } }
function hide_hint() { if (game_is_running) { if (total_seconds > 4) total_seconds -= 4; $("#level_" + current_level + " .vas .empty_vas, #level_" + current_level + " .vas .position, #level_" + current_level + " .figure").removeClass("invisible"); } }

function position_figures() {
	if ($("#level_" + current_level + " .position .figure").length != 0) $("#level_" + current_level + " .position .figure").each(function() { remove_figure($(this).attr("id"),true); });
	$("#level_" + current_level + " .figure").each(function() {
		$(this).removeClass("invisible").draggable("enable");	
		var f_id = $(this).attr("id").split("_")[2] + "_" + $(this).attr("id").split("_")[3]; var init_top = ""; var init_left = "";
		$.each(game_data.vases, function(i,v) { if (v.level == current_level) { $.each(v.figures, function(i,w) { if (w.id == f_id) { init_top = w.top; init_left = w.left; } }); } });
		$(this).attr("top",init_top).attr("left",init_left).css({ "position" : "absolute", "top" : init_top, "left" : init_left });
	});	
}
function add_figure_text(){
	$("#level_" + current_level + " .figure").each(function() {
		var f_id = $(this).attr("id").split("_")[2] + "_" + $(this).attr("id").split("_")[3]; var f_speech = "";
		$.each(game_data.vases, function(i,v) { if (v.level == current_level) { $.each(v.figures, function(i,w) { if (w.id == f_id) { f_speech = eval("w.text." + lang); } }); } });
		if (f_speech !== "-") $(this).attr("theTitle", f_speech); else $(this).removeAttr("theTitle");
		if (isMobile) $(this).bind("touchstart", function() { ddrivetip(f_speech); }).bind("touchend", function() { hideddrivetip(); }).bind("touchmove", function() { hideddrivetip(); });
	});
}
function drop_figure(e,figure_id,position_id) {
	e.preventDefault();
	$("#" + figure_id).mouseover(function() { hideddrivetip(); });
	if (position_id == "level_" + current_level + "_figures") remove_figure(figure_id);
	else {
		if ($("#" + figure_id).data().parent_id == "level_" + current_level + "_figures") {
			if ($("#" + position_id).find($(".figure")).length == 0 && position_id.split("_")[3] == figure_id.split("_")[3]) $("#" + position_id).append($("#" + figure_id));
		} else {
			$("#" + $("#" + figure_id).data().parent_id).append($("#" + position_id + " .figure"));
			$("#" + position_id).append($("#" + figure_id));
		}		
	}
}
function remove_figure(figure_id, hard) { if (game_is_running || hard) { $("#level_" + current_level + " .figures").append($("#" + figure_id)).queue(function() { $("#" + figure_id).css({ "position":"absolute", "top":$("#" + figure_id).attr("top"), "left":$("#" + figure_id).attr("left") }).removeClass("invisible").mouseover(function() { if (typeof $(this).attr("theTitle") !== typeof undefined && $(this).attr("theTitle") !== false) ddrivetip($(this).attr("theTitle")); }); /* toggle_check_button(current_level); */ $(this).dequeue(); }); } }
function check_positions() {
	var correct_positions = 0;
	$("#level_" + current_level + " .position").each(function() { if ($(this).find(".figure").length != 0) { if ($(this).find(".figure").attr("id").split("_")[3] == $(this).attr("id").split("_")[3]) correct_positions++; } });
	if (correct_positions == $("#level_" + current_level + " .position").length) end_game(current_level,1);
	else {
		if (total_seconds == 0) end_game(current_level,0);
		else {
			show_message({ "message":eval("game_data.texts." + lang + ".try_again"), "buttons":[] });
		}
	}
}

function end_game(level,correct) {	
	$(".vas_hint").each(function() { $(this).unbind("click"); });
	if (correct) {
		pause_timer(); game_is_running = false;
		$("#level_" + level + "_vas_check_button, #clock, #level_" + level + "_vas_hint, #level_" + level + " .vas .empty_vas, #level_" + level + " .vas .position, #level_" + level + " .figure").addClass("invisible");
		var level_vas = game_data.vases.filter(function(val, index, array) { return val.level == level; });
		var next_level = Math.round(level) + 1; if (next_level == 6) next_level = "init";
		$("#level_" + level + "_vas_caption").html("<br/><br/><img src='assets/img/correct_" + lang + ".svg'/><br/><br/><p>" + eval("level_vas[0].caption." + lang) + "</p><br/><br/><div class='button next_level'>" + ((next_level != "init") ? eval("game_data.texts." + lang + ".next_level_button") : eval("game_data.texts." + lang + ".restart_button") ) + "</div>");			
		if (next_level != "init") $("#level_" + level + " .next_level").removeClass("disabled").attr("onclick", "goto_screen('level_" + next_level + "');");
		else $("#level_" + level + " .next_level").removeClass("disabled").attr("onclick", "$('#intro').removeClass('instructions'); goto_screen('init');");
	} else {
		stop_timer(); game_is_running = false;
		$("#level_" + level + " .figures .figure").addClass("invisible");
		$("#level_" + level + "_vas_caption").html("<br/><br/><img src='assets/img/wrong_" + lang + ".svg'/><br/><br/><div class='button' onclick='goto_screen(\"level_" + current_level + "\");'>" + eval("game_data.texts." + lang + ".retry_button") + "</div>");
		$("#level_" + level + "_vas_check_button").addClass("invisible");
	}	
}
/* */


/* generic and external functions */
$.fn.extend({ 
	titlesBehaviour: function() { if (!isMobile) { $(this).each(function() { if ($(this).parent().hasClass("figures")) { $(this).mouseover(function() { ddrivetip($(this).attr("theTitle")); }).mouseout(function() { hideddrivetip(); }).mousedown(function() { hideddrivetip(); }); } }); } },
	disableSelection: function() { this.each(function() { this.onselectstart = function() { return false; }; this.unselectable = "on"; $(this).css('-moz-user-select', 'none'); $(this).css('-webkit-user-select', 'none'); }); return this; }
});
function getUrlParam(name) { name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]"); var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"), results = regex.exec(location.search); return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " ")); } /* taken from http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript */
function disableHover() { if (touch) { try { for (var si in document.styleSheets) {	var styleSheet = document.styleSheets[si]; if (!styleSheet.rules) continue;	for (var ri = styleSheet.rules.length - 1; ri >= 0; ri--) {	if (!styleSheet.rules[ri].selectorText) continue; if (styleSheet.rules[ri].selectorText.match(':hover')) { stylesheet.deleteRule(ri); }	} } } catch (ex) {}	} } /* taken from http://stackoverflow.com/questions/23885255/how-to-remove-ignore-hover-css-style-on-touch-devices */
/* Cool DHTML tooltip script - Dynamic Drive DHTML code library (www.dynamicdrive.com) - This notice MUST stay intact for legal use - Visit Dynamic Drive at http://www.dynamicdrive.com/ for full source code */
var offsetxpoint = -60; var offsetypoint = 20; var ie = document.all; var ns6 = document.getElementById && !document.all; var enabletip = false;
if (ie || ns6) var tipobj = document.all ? document.all["dhtmltooltip"] : document.getElementById ? document.getElementById("dhtmltooltip") : "";
function ietruebody() { return (document.compatMode && document.compatMode != "BackCompat") ? document.documentElement : document.body; }
function ddrivetip(thetext, thecolor, thewidth) { if (ns6 || ie) { if (typeof thewidth != "undefined") tipobj.style.width = thewidth + "px"; if (typeof thecolor != "undefined" && thecolor != "") tipobj.style.backgroundColor = thecolor; tipobj.innerHTML = thetext; enabletip = true; return false; } }
function positiontip(e) { if (enabletip) { var curX = (ns6) ? e.pageX : event.clientX + ietruebody().scrollLeft; var curY = (ns6) ? e.pageY : event.clientY + ietruebody().scrollTop; var rightedge = ie && !window.opera ? ietruebody().clientWidth - event.clientX - offsetxpoint : window.innerWidth - e.clientX - offsetxpoint - 20; var bottomedge = ie && !window.opera ? ietruebody().clientHeight - event.clientY - offsetypoint : window.innerHeight - e.clientY - offsetypoint - 20; var leftedge = (offsetxpoint < 0) ? offsetxpoint * (-1) : -1000; if (rightedge < tipobj.offsetWidth) tipobj.style.left = ie ? ietruebody().scrollLeft + event.clientX - tipobj.offsetWidth + "px" : window.pageXOffset + e.clientX - tipobj.offsetWidth + "px"; else if (curX < leftedge) tipobj.style.left = "5px"; else tipobj.style.left = curX + offsetxpoint + "px"; if (bottomedge < tipobj.offsetHeight) tipobj.style.top = ie ? ietruebody().scrollTop + event.clientY - tipobj.offsetHeight - offsetypoint + "px" : window.pageYOffset + e.clientY - tipobj.offsetHeight - offsetypoint + "px"; else tipobj.style.top = curY + offsetypoint + "px"; tipobj.style.visibility = "visible"; } }
function hideddrivetip() { if (ns6 || ie) { enabletip = false; tipobj.style.visibility = "hidden"; tipobj.style.left = "-1000px"; tipobj.style.backgroundColor = ''; tipobj.style.width = ''; } }
document.onmousemove = positiontip;
/* */
/* */