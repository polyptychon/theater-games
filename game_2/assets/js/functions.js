/* global vars */
var isIE = $.browser.msie; var isIE8 = $.browser.msie && ($.browser.version.indexOf(8) != -1); var isIE9 = $.browser.msie && ($.browser.version.indexOf(9) != -1);
var isMobile = false; if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;
var touch = ('ontouchstart' in document.documentElement);
var lang = ((getUrlParam("lang") == "gr" || !getUrlParam("lang")) ? "gr" : "en");
var game_data = "";
var selected_area = "";
var calendar_read = false;
var calendar_pages_seen = new Array();
var correct_figures_positions = new Array();
var figures_positions = new Array();
var sound = false;
/* */


/* window/document states */
$(window).load(function() {
	if (isIE8 || isIE9) {
		$("body").html("<div style='width:1024px; text-align:center; margin:25px auto;'>This site uses web technologies that your browser (Internet Explorer " + $.browser.version + ") doesn't support.<br/>Please visit the site using a new version of <a href='https://www.google.com/intl/en/chrome/browser/'>Google Chrome</a>, <a href='http://www.mozilla.org/en-US/firefox/new/'>Mozilla Firefox</a>, <a href='https://www.apple.com/safari/'>Safari</a> or <a href='http://www.opera.com/'>Opera</a>.<br/>Sorry for the inconvenience :-/</div>");
	} else {
		init();	
		$("#container").attr("lang",lang);
		$("#start_game, #restart").click(function() { goto_screen("level_1"); });
		$("#enter_game").click(function() { $("#intro").addClass("instructions"); });
		$("#continue_intro").click(function() { $("#intro").removeClass("instructions").addClass("more_instructions"); });
		$("#help").click(function() { if (!$(this).hasClass("disabled")) show_help(); });
		$("#close_help").click(function(event) { hide_help(); event.stopPropagation(); });
		$("#close_message").click(function(event) { hide_message("down"); event.stopPropagation(); });
		$("#close_calendar").click(function(event) { hide_calendar(); event.stopPropagation(); });
		$("#close_figures_popup").click(function(event) { hide_figures_popup(); event.stopPropagation(); });
		$("#calendar_button").click(function() { if (!$(this).hasClass("disabled")) { if (!$("#calendar").hasClass("open")) show_calendar(); else hide_calendar(); } });
		randomize_figures();	
		activate_figures();
		$(".position").droppable({hoverClass:"hovered", drop: function(event,ui) { var position_id = $(this).attr("id"); drop_figure(event,$(ui.draggable).attr("id"),position_id); } });
		$("*[theTitle]").titlesBehaviour();	
		$(document).keyup(function(e) {
			if (e.keyCode == 27 /* escape */ || e.keyCode == 13 /* enter */) { hide_help(); hide_message(); hide_calendar(); }
		}).keydown(function(e) {
			if(!(e.keyCode == 13 && e.metaKey)) return;
			goto_screen("level_1"); show_game(); /* game_solution(); */
		});
		if (touch) { disableHover(); window.scrollTo(0,1); }
		setTimeout(function() { $("#loader").fadeOut(500, function() { $(this).remove(); }); }, 500);
	}
});
/* */


/* game functions */
function init() {	
	$.getJSON("data.json", function(data) { game_data = data; }).complete(function() {
		$("head title").html(eval("game_data.texts." + lang + ".game_title"));
		$("#game_title").attr("src","assets/img/game_2_title_" + lang + ".svg");
		$("#game_subtitle").html(eval("game_data.texts." + lang + ".intro"));
		$("#game_instructions").html(eval("game_data.texts." + lang + ".intro_instructions"));
		$("#enter_game").html(eval("game_data.texts." + lang + ".enter_game_button"));
		$("#continue_intro").html(eval("game_data.texts." + lang + ".continue_intro_button"));
		$("#start_game").html(eval("game_data.texts." + lang + ".start_game_button"));
		$("#help_text").html(eval("game_data.texts." + lang + ".help_text"));
		$("#intro").removeClass("instructions");
		render_calendar_content(eval("game_data.texts." + lang + ".the_feast_calendar.pages"));
		activate_game_button();
		$(".figure").each(function() { get_figure_name($(this).attr("id")); });				
		$("#calendar_button").attr("theTitle",eval("game_data.texts." + lang + ".the_feast_calendar.handle_tooltip"));
		$("#play_button_message").html(eval("game_data.texts." + lang + ".game_button_message"));		
		$("*[theTitle]").titlesBehaviour();
		for (f = 0; f < game_data.figures.length; f++) correct_figures_positions.push(game_data.figures[f].id + "_" + game_data.figures[f].correct_position);
		$("#check_figures_positions_button").html(eval("game_data.texts." + lang + ".check_figures_positions_button"));
		goto_screen("init");
	});
}

function goto_screen(which) {	
	if ($("#" + which).hasClass("hidden")) $("#" + which).removeClass("hidden");
	if (which.indexOf("level") != -1) { $("#help, #calendar, #game, #calendar_button, #game_button, #sound_settings").removeClass("invisible"); }
	else { $("#help, #calendar, #game, #calendar_button, #game_button, #sound_settings").addClass("invisible"); }
	if (which == "level_1") {
		if (sound) play_sound("acropolis_sound");
		setTimeout(function() {
			$("#level_1_area_1").attr("class","hint").delay(500).queue(function() {
				$(this).attr("class","").dequeue();
				$("#level_1_area_2").attr("class","hint").delay(500).queue(function() {
					$(this).attr("class","").dequeue();
					$("#level_1_area_3").attr("class","hint").delay(500).queue(function() {
						$(this).attr("class","").dequeue();
					});
				});
			});
		}, 500);
	}
	$(".screen").each(function() { if ($(this).attr("id") != which) $(this).addClass("hidden"); });
}

function select_svg_area(level,which_area) {
	if (selected_area == "") { selected_area = which_area.id; $("#" + selected_area).unbind('mouseleave').attr({ "class" : "selected" }); show_calendar(which_area.getAttribute("show")); }
	else {
		if (which_area.id != selected_area) { $("#" + selected_area).attr({ "class" : "" }); selected_area = which_area.id; $("#" + selected_area).unbind('mouseleave').attr({ "class" : "selected" }); show_calendar(which_area.getAttribute("show")); }
		else { selected_area = ""; $("#" + level + " path").each(function() { $(this).attr({ "class" : "" }); }); }
	}
}
function unselect_all() { selected_area = ""; $("path").each(function() { $(this).attr({ "class" : "" }); }); }
function init_svg_objects(level) { $("#" + level + " svg *").removeAttr("class").removeAttr("style"); }

function show_help() { hide_calendar(); $("#help_icon").addClass("invisible").delay(100).queue(function() { $("#help").removeClass("hidden"); $(this).dequeue(); }).delay(100).queue(function() { $("#help_text").removeClass("invisible"); $("#close_help").removeClass("invisible"); $(this).dequeue(); }); }
function hide_help() { $("#help_text").addClass("invisible"); $("#close_help").addClass("invisible"); $("#help_icon").removeClass("invisible"); $("#help").addClass("hidden"); }

function activate_game_button(){
	if (calendar_read) { $("#play_button_message").removeClass("hidden").delay(4000).queue(function() { $(this).addClass("hidden"); $(this).dequeue(); }); $("#game_button").removeClass("disabled").attr("theTitle",eval("game_data.texts." + lang + ".game_button_tooltip.active")).click(function() { if (!$(this).hasClass("disabled")) show_game(); }); $("*[theTitle]").titlesBehaviour(); }
	else { $("#game_button").addClass("disabled").attr("theTitle",eval("game_data.texts." + lang + ".game_button_tooltip.inactive")).unbind("click"); $("*[theTitle]").titlesBehaviour(); }
}

function render_calendar_content(texts) {
	var content_html = ""; var days_titles_html = "";
	for (page = 1; page <= Object.keys(texts).length; page++) {
		var page_text = eval("texts.page_" + page);
		var page_bg = "assets/img/day_" + page + ".jpg";
		content_html += "<div id='page_" + page + "' class='calendar_day " + (page == 1 || page == Object.keys(texts).length? "hard" : "") + "' onclick='change_page(this)'>" + page_text + "</div>";
	}
	$("#calendar_flipbook").html(content_html).turn({width:"100%",height:"100%",acceleration:false});
	$("#calendar_flipbook").bind("turning", function(event,page) {		
		if (page > 1 && page < 11) {
			if (page % 2 == 0) {
				if (calendar_pages_seen.indexOf("page_" + page + "_page_" + (Math.round(page) + 1)) == -1) {
					calendar_pages_seen.push("page_" + page + "_page_" + (Math.round(page) + 1));
				}
				check_calendar_pages_seen();
			} else {
				if (calendar_pages_seen.indexOf("page_" + (Math.round(page) - 1) + "_page_" + page) == -1) {
					calendar_pages_seen.push("page_" + (Math.round(page) - 1) + "_page_" + page);
				}
				check_calendar_pages_seen();
			}
		}
	});
	
}
function show_calendar(page) {
	hide_help(); hide_message();	
	if (page == null) page = "page_1";
	$("#calendar_flipbook").turn("page", page.split("_")[1]);	
	if (!$("#calendar").hasClass("open")) { $("#calendar").addClass("open"); } else { if (page == null) $("#calendar").removeClass("open"); unselect_all(); }
}
function hide_calendar() { $("#calendar").removeClass("open"); unselect_all(); }
function check_calendar_pages_seen() {
	if (!calendar_read) if (calendar_pages_seen.length == 5) { calendar_read = true; activate_game_button(); }
}
function change_page(current_page) {
	var page_num = $(current_page).attr("id").split("_")[1];
	if (page_num % 2 == 0) { if (page_num > 0) $("#calendar_flipbook").turn("page", parseInt(page_num) - 1); }
	else { if (page_num < 11) { $("#calendar_flipbook").turn("page", parseInt(page_num) + 1); } }
}
function activate_figures() { $(".figure").draggable({revert:"invalid", start: function() { $(this).data("info", { "init_position" : $(this).position(), "parent_id" : $(this).parent().attr("id") }); }}).bind("click", function() { if (!$(this).parent().hasClass("position")) show_figure_info($(this).attr("id")); }); }
function randomize_figures() { $("#figures").shuffleChildren(); }
function show_game() {
	hide_calendar(); hide_help(); hide_message(); $("#play_button_message").addClass("hidden");
	$("#level_1, #level_2").addClass("playing");
	$("#game_button").attr("theTitle",eval("game_data.texts." + lang + ".back_to_stage_button")).addClass("pause").unbind("click").click(function() { if (!$(this).hasClass("disabled")) hide_game(); });
}
function hide_game() {
	hide_calendar(); hide_help(); hide_message();
	$("#level_1, #level_2").removeClass("playing");
	$("#game_button").attr("theTitle",eval("game_data.texts." + lang + ".continue_game_button")).removeClass("pause").unbind("click").click(function() { show_game(); });
}
function reset_game(everything) {
	$(".position").each(function() { $(this).removeClass("no_border"); $("#figures").append($(this).find(".figure")).queue(function() { $("#figures .figure").css({ "position" : "relative", "top" : 0, "left" : 0 }); $(this).dequeue(); }); });
	randomize_figures();
	activate_figures();
	figures_positions = new Array();
	activate_check_positions_button();
	$("#check_figures_positions_button").removeClass("hidden");
	if (everything == "everything") {
		calendar_read = false;
		calendar_pages_seen = new Array();
		activate_game_button();
		hide_game();
		$("#calendar_flipbook").turn("page", 1);
	}
}

function game_solution() { $(".figure").each(function() { var id = $(this).attr("id").replace("f",""); $("#pos" + id).append($(this)); }); }
function get_figure_name(figure_id) { var f_tooltip = ""; $.each(game_data.figures, function(i,v) { if (v.id == figure_id) { var f_tooltip = $(eval("v.text." + lang)).eq(0).text(); $("#" + figure_id).attr("theTitle", f_tooltip).mousedown(function() { hideddrivetip(); }); } }); }
function get_position_name(position_id) { var position_name = ""; $.each(game_data.positions, function(i,v) { if (v.id == position_id) { position_name = eval("v.text." + lang); } }); return position_name; }
function show_figure_info(figure_id) {
	$("#help, #calendar_button, #game_button").addClass("disabled");
	var f_speech = "";
	$.each(game_data.figures, function(i,v) { if (v.id == figure_id) { f_speech = eval("v.text." + lang); } });	
	var position_select = "<b>" + eval("game_data.texts." + lang + ".position_select") + "</b><br/><select id='position_select' " + ((isMobile) ? "class='mobile'" : "size='6'") + ">" + get_available_seats_options() + "</select><br/><br/><div id='place_figure' class='button' onclick='place_figure(\"" + figure_id + "\",$(\"#position_select\").val())'>" + eval("game_data.texts." + lang + ".place_figure_button") + "</div>";
	$("#figure_img").html("").html("<img src='assets/img/" + figure_id + "_big.png'/>");
	$("#figure_info").html("").html(f_speech + "<br/>" + position_select);
	$("#figures_popup").addClass("opened");
}
function hide_figures_popup() { $("#figures_popup").removeClass("opened"); $("#help, #calendar_button, #game_button").removeClass("disabled"); }
function place_figure(figure_id,position_id) {
	if (position_id) {
		hide_figures_popup();
		$("#" + position_id).append($("#" + figure_id));
		figures_positions.push(figure_id + "_" + position_id);
		activate_check_positions_button();
	}
}
function get_available_seats_options() { var options_html = ""; $(".position").each(function() { options_html += "<option value='" + $(this).attr("id") + "' " + ( ($(this).find($(".figure")).length != 0) ? "disabled" : "") + ">" + get_position_name($(this).attr("id")) + "</option>"; });	return options_html; }
function drop_figure(e,figure_id,position_id) {
	e.preventDefault();
	var parent_id = $("#" + figure_id).data("info").parent_id;	
	if (position_id.indexOf("f") != -1) position_id = $("#" + position_id).parent().attr("id");
		
	if (parent_id != "figures") {	
		if ($("#" + position_id).find($(".figure")).length == 0) {			
			var existing_figure_id = $("#" + parent_id).find($(".figure")).attr("id");
			existing_f_pos_array_value = existing_figure_id + "_" + parent_id;
			figures_positions.splice(figures_positions.indexOf(existing_f_pos_array_value), 1);
			e.target.appendChild(document.getElementById(figure_id));
			figures_positions.push(figure_id + "_" + position_id);
		} else {
			/* first move existing figure away */
			var existing_figure_id = $("#" + position_id).find($(".figure")).attr("id");
			$("#" + parent_id).append($("#" + existing_figure_id));
			existing_f_pos_array_value = existing_figure_id + "_" + position_id;
			figures_positions.splice(figures_positions.indexOf(existing_f_pos_array_value), 1);
			figures_positions.push(existing_figure_id + "_" + parent_id);
			/* then place new figure */
			previous_f_pos_array_value = figure_id + "_" + parent_id;
			$("#" + position_id).append($("#" + figure_id));
			figures_positions.splice(figures_positions.indexOf(previous_f_pos_array_value), 1);
			figures_positions.push(figure_id + "_" + position_id);
		}
	} else {
		if ($("#" + position_id).find($(".figure")).length == 0) {
			e.target.appendChild(document.getElementById(figure_id));
			figures_positions.push(figure_id + "_" + position_id);
			activate_check_positions_button();
		} else {
			$("#" + figure_id).animate($("#" + figure_id).data("info").init_position,"fast");
		}
	}
}
function remove_figure(pos) {
	var position_id = $(pos).attr("id");
	var figure_id = $(pos).find(".figure").attr("id");
	f_pos_array_value = figure_id + "_" + position_id;
	$("#figures").append($("#" + figure_id)).queue(function() { $("#" + figure_id).css({ "position" : "relative", "top" : 0, "left" : 0 }); $(this).dequeue(); });
	figures_positions.splice(figures_positions.indexOf(f_pos_array_value), 1);
	activate_check_positions_button();
}
function activate_check_positions_button() {
	if ($(".position .figure").length == 6) $("#check_figures_positions_button").removeClass("disabled").click(function() { check_positions(); });
	else $("#check_figures_positions_button").addClass("disabled").unbind("click");
}
function check_positions() {
	sorted_figures_positions = figures_positions.sort();
	sorted_correct_positions = correct_figures_positions.sort();
	if (sorted_figures_positions.equals(sorted_correct_positions)) end_game("correct");
	else end_game("wrong");
}

function show_message(params) {
	hide_calendar();	
	$("#message").html("").html(params.message + "<br/><br/>");
	$("#buttons").html(""); for (b = 0; b < params.buttons.length; b++) { $("#buttons").append("<div class='button' onclick='hide_message(); " + params.buttons[b].action.toString() + "'>" + params.buttons[b].button + "</div>"); }	
	$("#popup").removeClass("down").removeClass("invisible");
}
function hide_message(where) { if (where == "down") { if (!$("#popup").hasClass("down")) $("#popup").addClass("down"); else $("#popup").removeClass("down"); } else $("#popup").addClass("invisible"); }

function end_game(result) {	
	$(".position").addClass("no_border"); $("#check_figures_positions_button").addClass("hidden");
	if (result == "correct") show_message({ "message":eval("game_data.texts." + lang + ".correct_end"), "buttons":[{ "button":eval("game_data.texts." + lang + ".restart_button"), "action":'$("#intro").removeClass("more_instructions"); reset_game("everything"); goto_screen("init");' }]});		
	else show_message({ "message":eval("game_data.texts." + lang + ".wrong_end"), "buttons":[{ "button":eval("game_data.texts." + lang + ".play_again_button"), "action":'reset_game();' }]});
}
/* */


/* generic and external functions */
$.fn.extend({ 
	titlesBehaviour: function() { if (!isMobile) { $(this).each(function() { $(this).mouseover(function() { ddrivetip($(this).attr("theTitle")); }); $(this).mouseout(function() { hideddrivetip(); }); }); } },
	disableSelection: function() { this.each(function() { this.onselectstart = function() { return false; }; this.unselectable = "on"; $(this).css('-moz-user-select', 'none'); $(this).css('-webkit-user-select', 'none'); }); return this; },
	shuffleChildren: function() { $.each(this.get(), function(index, el) { var $el = $(el); var $find = $el.children(); $find.sort(function() { return 0.5 - Math.random(); }); $el.empty(); $find.appendTo($el); }); } /* taken from https://css-tricks.com/snippets/jquery/shuffle-children/ */
});
Array.prototype.equals = function (array) {
    if (!array) return false;
    if (this.length != array.length) return false;
    for (var i = 0, l=this.length; i < l; i++) { if (this[i] instanceof Array && array[i] instanceof Array) { if (!this[i].equals(array[i])) return false; } else if (this[i] != array[i]) { return false; } }       
    return true;
}
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