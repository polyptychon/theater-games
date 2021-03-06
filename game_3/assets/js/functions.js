/* global vars */
var isIE = $.browser.msie; var isIE8 = $.browser.msie && ($.browser.version.indexOf(8) != -1); var isIE9 = $.browser.msie && ($.browser.version.indexOf(9) != -1);
var isMobile = false; if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;
var touch = ('ontouchstart' in document.documentElement);
var lang = ((getUrlParam("lang") == "gr" || !getUrlParam("lang")) ? "gr" : "en");
var game_data = "";
var carousel_interval = "";
var theaters_added_to_schedule = new Array();
var correct_schedule = new Array();
var current_date = "";
var levels_played = new Array();
/* */


/* window/document states */
$(window).load(function() {
	if (isIE8 || isIE9) {
		$("body").html("<div style='width:1024px; text-align:center; margin:25px auto;'>This site uses web technologies that your browser (Internet Explorer " + $.browser.version + ") doesn't support.<br/>Please visit the site using a new version of <a href='https://www.google.com/intl/en/chrome/browser/'>Google Chrome</a>, <a href='http://www.mozilla.org/en-US/firefox/new/'>Mozilla Firefox</a>, <a href='https://www.apple.com/safari/'>Safari</a> or <a href='http://www.opera.com/'>Opera</a>.<br/>Sorry for the inconvenience :-/</div>");
	} else {
		init();	
		$("#container").attr("lang",lang);
		$("#close_descriptions").click(function() { $("#descriptions").removeClass("open"); $(".theater").removeClass("selected"); });
		$("#check_schedule").unbind("click");
		$("#num_of_theaters").html(0);
		$("#start_greece").click(function() { goto_screen("level_greece"); });
		$("#start_mediterranean").click(function() { goto_screen("level_mediterranean"); });
		$("#enter_game").click(function() { $("#intro").addClass("instructions"); });
		$("#help").click(function() { show_help(); });
		$("#close_help").click(function(event) { hide_help(); event.stopPropagation(); });
		$("#close_message").click(function(event) { hide_message("down"); event.stopPropagation(); });
		$(document).keyup(function(e) {
		  if (e.keyCode == 27 /* escape */) { $(".theater").removeClass("selected"); $("#descriptions").removeClass("open"); hide_help(); }
		  else if (e.keyCode == 13 /* enter */) { $("#theater_button .button").click(); }
		});
		if (touch) { disableHover(); window.scrollTo(0,1); }
		setTimeout(function() { $("#loader").fadeOut(500, function() { $(this).remove(); }); }, 500);
	}
});
/* */


/* game functions */
function init() {
	$.getJSON("data.json", function(data) { game_data = ""; game_data = data; }).complete(function() {
		$("head title").html(eval("game_data.texts." + lang + ".game_title"));
		$("#game_title").attr("src","assets/img/game_3_title_" + lang + ".svg");
		$("#game_subtitle").html(eval("game_data.texts." + lang + ".intro"));
		$("#enter_game").html(eval("game_data.texts." + lang + ".enter_game_button"));
		$("#start_greece").attr("theTitle",eval("game_data.texts." + lang + ".start_greece_game_button"));
		$("#start_mediterranean").attr("theTitle",eval("game_data.texts." + lang + ".start_mediterranean_game_button"));
		$("#help_text").html(eval("game_data.texts." + lang + ".help_text"));
		$("#intro").removeClass("instructions");
		$("#check_schedule").html(eval("game_data.texts." + lang + ".check_schedule_button"));
		$("#tour_schedule_title").html(eval("game_data.texts." + lang + ".tour_schedule"));
		$("*[theTitle]").titlesBehaviour();
		goto_screen("init");		
	});
}

function goto_screen(which) {
	if (which.indexOf("level_") != -1) {
		var level = which.split("_")[1];
		theaters_added_to_schedule = [];
		correct_schedule = [];
		$("#tour_theaters").html("").removeClass("invisible");
		$(".all_correct_theaters").removeClass("opened");
		$("#check_schedule").addClass("disabled").attr("level",level).unbind("click");
		$("#" + which + "_theaters").html("");		
		add_theaters(level);
		activate_add_theater_button(level);
		if ($("#descriptions").hasClass("open")) $("#descriptions").removeClass("open");
		$("#tour_schedule, #help").removeClass("invisible");
		current_date = "";
	} else { $("#tour_schedule, #help").addClass("invisible"); levels_played = new Array(); }	
	if ($("#" + which).hasClass("hidden")) $("#" + which).removeClass("hidden");
	$(".screen").each(function() { if ($(this).attr("id") != which) $(this).addClass("hidden"); });
}

function add_theaters(where) {
	var theaters = game_data.theaters[where];
	correct_schedule[where] = new Array();
	theaters_added_to_schedule[where] = new Array();
	for (t = 0; t < theaters.length; t++) {
		$("#" + where + "_theaters").append("<div id='" + theaters[t].id + "' level='" + where + "' numOfImgs='" + theaters[t].num_of_imgs + "' class='theater' theTitle='" + eval("theaters[t].name." + lang) + "' type='" + theaters[t].type + "' inUse='" + theaters[t].in_use + "' style='left:" + theaters[t].left + "px; top:" + theaters[t].top + "px;'><span>" + eval("theaters[t].description." + lang) + "</span></div>");
		if (theaters[t].in_use == "yes") {
			correct_schedule[where].push(theaters[t].id);			
			$("#final_correct_" + where + "_theaters").append('<div id="correct_irodio" class="correct_theater_name" style="position:absolute; top:' + theaters[t].top_name + 'px; left:' + theaters[t].left_name + 'px">' + eval("theaters[t].name." + lang) + '</div>');
		}
	}
	$("*[theTitle]").titlesBehaviour();
	activate_theaters(where);
}

function activate_theaters(where) {
	$(".theater").click(function() {
		if (!$(this).hasClass("selected")) { $(".theater").removeClass("selected"); $(this).addClass("selected"); } else { $(this).removeClass("selected"); $("#descriptions").removeClass("open"); }
		$("#carousel_images").html(""); for (i = 1; i <= $(this).attr("numOfImgs"); i++) $("#carousel_images").append("<div class='carousel_image " + (i == 1 ? "visible" : "") + "' style='background-image:url(\"assets/img/400x300/" + $(this).attr("id") + "_" + i + ".jpg\");'></div>");
		activate_carousel();
		$("#theater_title").html("").html("<h3>" + $(this).attr("theTitle") + "</h3>");
		$("#theater_description").html("").scrollTop(0).html($(this).find("span").html());
		$("#theater_button").html("").html("<div class='button' for_theater='" + $(this).attr("id") + "'></div>");
		activate_add_theater_button(where);
		if (!$("#descriptions").hasClass("open")) $("#descriptions").addClass("open");
	}).removeClass("correct");
}

function activate_add_theater_button(where) {
	var theater_to_add_id = $("#theater_button .button").attr("for_theater");
	var theater_to_add_name = $("#theater_title").text();	

	/* check if theater is already added to the tour schedule */
	var theater_already_added = ( theaters_added_to_schedule[where].indexOf(theater_to_add_id) > -1 ? true : false );
	
	if (!theater_already_added) {
		$("#theater_button .button").html(eval("game_data.texts." + lang + ".add_to_schedule_button")).removeClass("red").addClass("green").unbind("click").click(function() {
			theaters_added_to_schedule[where].push(theater_to_add_id);
			$("#num_of_theaters").html(theaters_added_to_schedule[where].length);
			if (theaters_added_to_schedule[where].length == correct_schedule[where].length) $("#check_schedule").removeClass("disabled").click(function() { check_schedule(); });
			$(this).html(eval("game_data.texts." + lang + ".remove_from_schedule_button")).removeClass("green").addClass("red");
			$("#tour_theaters").append("<div class='tour_theater' theater_id='" + theater_to_add_id + "'>" + randomDate() + "<br/>" + theater_to_add_name + "</div>").scrollTop($('#tour_theaters')[0].scrollHeight);
			activate_tour_theaters(where);
			activate_add_theater_button(where);
			$("#" + theater_to_add_id).addClass("added");			
		})
	} else {
		$("#theater_button .button").html(eval("game_data.texts." + lang + ".remove_from_schedule_button")).removeClass("green").addClass("red").unbind("click").click(function() {
			theaters_added_to_schedule[where].splice(theaters_added_to_schedule[where].indexOf(theater_to_add_id), 1);
			$("#num_of_theaters").html(theaters_added_to_schedule[where].length);
			if (theaters_added_to_schedule[where].length != correct_schedule[where].length) $("#check_schedule").addClass("disabled").unbind("click");
			$(this).html(eval("game_data.texts." + lang + ".add_to_schedule_button")).removeClass("red").addClass("green");
			$("#tour_theaters").find("[theater_id='" + theater_to_add_id + "']").remove();
			activate_add_theater_button(where);
			$("#" + theater_to_add_id).removeClass("added");			
		});
	}
}

function activate_tour_theaters(where) {
	$(".tour_theater").click(function() { $("#" + $(this).attr("theater_id")).removeClass("added"); if (theaters_added_to_schedule[where].indexOf($(this).attr("theater_id")) > -1) theaters_added_to_schedule[where].splice(theaters_added_to_schedule[where].indexOf($(this).attr("theater_id")), 1); $("#num_of_theaters").html(theaters_added_to_schedule[where].length); $(this).remove(); if (theaters_added_to_schedule[where].length != correct_schedule[where].length) $("#check_schedule").addClass("disabled").unbind("click"); activate_add_theater_button(where); });
}

function activate_carousel() {
	clearInterval(carousel_interval);
	carousel_interval = null;
	carousel_interval = setInterval(function() { if ($('.carousel_image.visible').next().hasClass("carousel_image")) $('.carousel_image.visible').removeClass("visible").next().addClass("visible"); else $('.carousel_image.visible').removeClass("visible").parent().find(".carousel_image:first").addClass("visible"); },  3000);
}

function check_schedule() {
	var level = $("#check_schedule").attr("level");
	sorted_theaters_schedule = theaters_added_to_schedule[level].sort();
	sorted_correct_schedule = correct_schedule[level].sort();
	if (sorted_theaters_schedule.equals(sorted_correct_schedule)) end_game(level,"correct");
	else end_game(level,"wrong");	
}
function get_correct_theaters_in_schedule(level) { return theaters_added_to_schedule[level].filter(function(n) { return correct_schedule[level].indexOf(n) != -1 }); }
function get_wrong_theaters_in_schedule(level) { return theaters_added_to_schedule[level].filter(function(n) { return correct_schedule[level].indexOf(n) == -1 }); }

function show_help() { $("#help_icon").addClass("invisible").delay(100).queue(function() { $("#help").removeClass("hidden"); $(this).dequeue(); }).delay(100).queue(function() { $("#help_text").removeClass("invisible"); $("#close_help").removeClass("invisible"); $(this).dequeue(); }); }
function hide_help() { $("#help_text").addClass("invisible"); $("#close_help").addClass("invisible"); $("#help_icon").removeClass("invisible"); $("#help").addClass("hidden"); }

function show_message(params) {	
	$("#message").html("").html(params.message + "<br/><br/>");
	$("#buttons").html(	""); for (b = 0; b < params.buttons.length; b++) { $("#buttons").append("<div class='button' onclick='" + params.buttons[b].action.toString() + "'>" + params.buttons[b].button + "</div>"); }	
	$("#popup").removeClass("down").removeClass("invisible");
}
function hide_message(where) { if (where == "down") { if (!$("#popup").hasClass("down")) $("#popup").addClass("down"); else $("#popup").removeClass("down"); } else $("#popup").addClass("invisible"); }

function end_game(level,result) {
	$("#descriptions").removeClass("open");
	var text_to_show = eval("game_data.texts." + lang + ".end_level_" + level + "_" + result);
	correct_theaters_in_schedule = get_correct_theaters_in_schedule(level);
	wrong_theaters_in_schedule = get_wrong_theaters_in_schedule(level);
	$(".theater").removeClass("added").removeClass("selected");
	$("#final_correct_" + level + "_theaters").addClass("opened");
	$.each(game_data.theaters[level], function(index,theater) {
		if (theater.in_use == "yes") { $(".theater[id='" + theater.id + "'], .tour_theater[theater_id='" + theater.id + "']").addClass("correct"); }
		else { $(".tour_theater[theater_id='" + theater.id + "']").addClass("wrong"); }
		return;
	});	
	if (result == "wrong") { var active_theaters = ""; $.each(game_data.theaters[level], function(index,theater) { if (theater.in_use == "yes" && correct_theaters_in_schedule.indexOf(theater.id) == -1) active_theaters += "<li>" + eval("theater.name." + lang) + "</li>"; return; }); text_to_show += "<ul style='text-align:left!important;'>" + active_theaters + "</ul></p>"; var correct_theaters = []; for (t = 0; t < correct_theaters_in_schedule.length; t++) $.each(game_data.theaters[level], function(index,theater) { if (theater.id == correct_theaters_in_schedule[t]) correct_theaters += "<li>" + eval("theater.name." + lang) + "</li>"; return; }); text_to_show = text_to_show.replace("{*}","<b>" + correct_theaters_in_schedule.length + "</b>").replace("{**}","<ul style='text-align:left!important;'>" + correct_theaters + "</ul>"); }
	
	levels_played.push(level);
	if (level == "greece") {
		if (levels_played.length == 1) {
			var button = eval("game_data.texts." + lang + ".next_level_button");
			var action = '$("#popup").addClass("invisible"); $("#num_of_theaters").html(0); $("#mediterranean_theaters").html(""); goto_screen("level_mediterranean");';
		} else {
			var button = eval("game_data.texts." + lang + ".restart_button");
			var action = 'levels_played = new Array(); $("#intro").removeClass("instructions"); $("#popup").addClass("invisible"); $("#num_of_theaters").html(0); current_date = ""; $("#greece_theaters").html(""); goto_screen("init");';
		}
	}
	else if (level == "mediterranean") {
		if (levels_played.length == 1) {
			var button = eval("game_data.texts." + lang + ".next_level_button");
			var action = '$("#popup").addClass("invisible"); $("#num_of_theaters").html(0); $("#greece_theaters").html(""); goto_screen("level_greece");';
		} else {
			var button = eval("game_data.texts." + lang + ".restart_button");
			var action = 'levels_played = new Array(); $("#intro").removeClass("instructions"); $("#popup").addClass("invisible"); $("#num_of_theaters").html(0); current_date = ""; $("#greece_theaters").html(""); goto_screen("init");';
		}
	}
	show_message({"message":text_to_show, "buttons":[{"button": button, "action": action}]});	
}
/* */


/* generic and external functions */
$.fn.extend({ 
	titlesBehaviour: function() { if (!isMobile) { $(this).each(function() { $(this).mouseover(function() { ddrivetip($(this).attr("theTitle")); }); $(this).mouseout(function() { hideddrivetip(); }); }); } },
	disableSelection: function() { this.each(function() { this.onselectstart = function() { return false; }; this.unselectable = "on"; $(this).css('-moz-user-select', 'none'); $(this).css('-webkit-user-select', 'none'); }); return this; }
});
Array.prototype.equals = function (array) {
    if (!array) return false;
    if (this.length != array.length) return false;
    for (var i = 0, l=this.length; i < l; i++) { if (this[i] instanceof Array && array[i] instanceof Array) { if (!this[i].equals(array[i])) return false; } else if (this[i] != array[i]) { return false; } }       
    return true;
}
function getUrlParam(name) { name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]"); var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"), results = regex.exec(location.search); return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " ")); } /* taken from http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript */
function randomDate() { var d = new Date(); var year = d.getFullYear(); if (current_date == "") { var start = new Date(year + "-06-01"); var end = new Date(year + "-07-30"); } else { var start = new Date(current_date); start.setDate(start.getDate() + 1); var end = new Date(current_date); end.setDate(end.getDate() + 15); }  var date = new Date(+start + Math.random() * (end - start)); current_date = date; return date.getDate() + "." + Math.round(date.getMonth() + 1) + "." + date.getFullYear(); }
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