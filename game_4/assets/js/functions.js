/* global vars */
var isMobile = false; if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;
var game_data = "";
var total_seconds = 0;
var timer_interval = null;
var game_is_running = false;
/* */


/* window/document states */
$(window).load(function() {
	init();
	$("*[theTitle]").titlesBehaviour();	
	$("#start_game").click(function() { goto_screen("level_1"); });
	$("#help").click(function() { show_help(); });
	$("#close_help").click(function(event) { hide_help(); event.stopPropagation(); });
	$("#close_message").click(function(event) { hide_message("down"); event.stopPropagation(); });
	$(document).keyup(function(e) {
	  if (e.keyCode == 27 /* escape */ || e.keyCode == 13 /* enter */) { hide_help(); hide_message(); }
	});
	setTimeout(function() { $("#loader").fadeOut(500, function() { $(this).remove(); }); }, 500);			
});
/* */


/* game functions */
function init() {	
	$.getJSON("data.json", function(data) { game_data = data; }).complete(function() {
		$("#game_title").html(game_data.texts.game_title);
		$("#game_subtitle").html(game_data.texts.intro);
		goto_screen("init");
	});
}

function goto_screen(which) {	
	if ($("#" + which).hasClass("hidden")) $("#" + which).removeClass("hidden");
	if (which.indexOf("level") != -1) { $("#help, #clock").removeClass("invisible"); start_timer(); game_is_running = true; }
	else { $("#help, #clock").addClass("invisible"); }	
	$(".screen").each(function() { if ($(this).attr("id") != which) $(this).addClass("hidden"); });
}

function show_help() { pause_timer(); $("#help_icon").addClass("invisible").delay(100).queue(function() { $("#help").removeClass("hidden"); $(this).dequeue(); }).delay(100).queue(function() { $("#help_text").removeClass("invisible"); $("#close_help").removeClass("invisible"); $(this).dequeue(); }); }
function hide_help() { if (total_seconds != 0 && game_is_running) start_timer(); $("#help_text").addClass("invisible"); $("#close_help").addClass("invisible"); $("#help_icon").removeClass("invisible"); $("#help").addClass("hidden"); }

function show_message(params) {	
	$("#message").html("").html(params.message + "<br/><br/>");
	$("#buttons").html(""); for (b = 0; b < params.buttons.length; b++) { $("#buttons").append("<div class='button' onclick='hide_message(); " + params.buttons[b].action.toString() + "'>" + params.buttons[b].button + "</div>"); }	
	$("#popup").removeClass("down").removeClass("invisible");
}
function hide_message(where) { if (where == "down") { if (!$("#popup").hasClass("down")) $("#popup").addClass("down"); else $("#popup").removeClass("down"); } else $("#popup").addClass("invisible"); }

function start_timer() { timer_interval = setInterval(clock_timer,1000); }
function clock_timer() { total_seconds++; var minutes = parseInt(total_seconds/60)%60; var seconds = total_seconds%60; $("#clock").html((minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds)); }
function pause_timer() { clearInterval(timer_interval); }
function stop_timer() { clearInterval(timer_interval); timer_interval = null; total_seconds = 0; }
function reset_timer() { $("#clock").html("00:00"); }

function drag_figure(e) { e.dataTransfer.setData("id", e.target.id); }
function allowDrop_figure(e) { e.preventDefault(); }
function drop_figure(e,level) {
	e.preventDefault();
	var figure_id = e.dataTransfer.getData("id");
	var position_id = e.target.id;
	if (($("#" + position_id).find($(".figure")).length == 0) && (position_id.split("_")[3] == figure_id.split("_")[3])) {
		$("#" + position_id).append($("#" + figure_id));
	} else {
		$(".vas").addClass("error").delay(150).queue(function() { $(this).removeClass("error").dequeue(); });
	}
	check_positions(level);
}
function check_positions(level) { if ($("#level_" + level + " .figures .figure").length == 0) end_game(level); }

function end_game(level) {
	if (level < 6) { /* all levels except level 6 */
		pause_timer(); game_is_running = false;
		$("#level_" + level + " .vas .empty_vas, #level_" + level + " .vas .position").addClass("invisible");
		$("#level_" + level + "_vas_caption").html("<h3>Μπράβο τα κατάφερες!</h3><p>" + game_data.vases.filter(function(val, index, array) { return val.level == level; })[0].caption + "</p><br/><br/><div class='button' onclick='goto_screen(\"level_2\")'>ΠΡΟΧΩΡΗΣΕ ΣΤΟ ΕΠΟΜΕΝΟ ΣΤΑΔΙΟ</div>");
		var next_level = Math.round(level + 1); $("#level_" + level + " .next_level").removeClass("disabled").attr("onclick", "goto_screen('level_" + next_level + "');");
	} else if (level == 6) {	
		show_message({ "message":game_data.texts.game_title, "buttons":[{ "button":"Ξεκινησε απο την αρχη", "action":'goto_screen("init");' }]});
	}
}
/* */


/* generic and external functions */
$.fn.extend({ 
	titlesBehaviour: function() {
		$(this).each(function() { $(this).mouseover(function() { ddrivetip($(this).attr("theTitle")); }); $(this).mouseout(function() { hideddrivetip(); }); });
	},
	disableSelection: function() { this.each(function() { this.onselectstart = function() { return false; }; this.unselectable = "on"; $(this).css('-moz-user-select', 'none'); $(this).css('-webkit-user-select', 'none'); }); return this; }
});
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