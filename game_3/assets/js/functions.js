/* global vars */
var isMobile = false; if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;
var theaters_added_to_schedule = new Array();
var game_data = "";
var carousel_interval = "";
var correct_schedule = new Array();
/* */


/* window/document states */
$(window).load(function() {
	init();	
	$("#close_descriptions").click(function() { $("#descriptions").removeClass("open"); $(".theater").removeClass("selected"); });
	$("#check_schedule").click(function() { check_schedule(); });
	$("#change_map").click(function() { if ($(this).html() == "GRE") { $(this).html("MED"); goto_screen("level_greece"); } else { $(this).html("GRE"); goto_screen("level_mediterranean"); } });
	setTimeout(function() { $("#loader").fadeOut(500, function() { $(this).remove(); }); }, 500);			
});
/* */


/* game functions */
function init() {	
	$.getJSON("data.json", function(data) { game_data = data; }).complete(function() {		
		add_theaters("greece");
		add_theaters("mediterranean");
		activate_add_theater_button();
		correct_schedule.sort();
		console.log(correct_schedule);
		$("*[theTitle]").titlesBehaviour();
		goto_screen("level_mediterranean");		
	});
}

function goto_screen(which) {
	if ($("#" + which).hasClass("hidden")) $("#" + which).removeClass("hidden");
	$(".screen").each(function() { if ($(this).attr("id") != which) $(this).addClass("hidden"); });
}

function add_theaters(where) {
	var theaters = game_data.theaters[where];
	for (t = 0; t < theaters.length; t++) {
		$( "#" + where + "_theaters" ).append("<div id='" + theaters[t].id + "' numOfImgs='" + theaters[t].num_of_imgs + "' class='theater' theTitle='" + theaters[t].name + "' type='" + theaters[t].type + "' inUse='" + theaters[t].in_use + "' style='left:" + theaters[t].left + "px; top:" + theaters[t].top + "px;'><span>" + theaters[t].description + "</span></div>");
		if (theaters[t].in_use == "yes") correct_schedule.push(theaters[t].id);
	}
	activate_theaters(where);
}

function activate_theaters(where) {
	$(".theater").each(function() { $(this).click(function() {
		if (!$(this).hasClass("selected")) { $(".theater").removeClass("selected"); $(this).addClass("selected"); } else { $(this).removeClass("selected"); $("#descriptions").removeClass("open"); }
		$("#carousel_images").html(""); for (i = 1; i <= $(this).attr("numOfImgs"); i++) $("#carousel_images").append("<div class='carousel_image " + (i == 1 ? "visible" : "") + "' style='background-image:url(\"assets/img/400x300/" + $(this).attr("id") + "_" + i + ".jpg\");'></div>");
		activate_carousel();
		$("#theater_title").html("").html("<h1>" + $(this).attr("theTitle") + "</h1><hr/>");
		$("#theater_description").html("").html($(this).find("span").html());
		$("#theater_button").html("").html("<div class='button' for_theater='" + $(this).attr("id") + "'></div>");
		activate_add_theater_button();
		if (!$("#descriptions").hasClass("open")) $("#descriptions").addClass("open");
	}); });
}

function activate_add_theater_button() {
	var theater_to_add_id = $("#theater_button .button").attr("for_theater");
	var theater_to_add_name = $("#theater_title").text();

	/* check if theater is already added to the tour schedule */
	var theater_already_added = ( theaters_added_to_schedule.indexOf(theater_to_add_id) > -1 ? true : false );
	
	if (!theater_already_added) {
		$("#theater_button .button").html("Προσθηκη στο προγραμμα της περιοδειας").removeClass("red").addClass("green").unbind("click").click(function() {
			theaters_added_to_schedule.push(theater_to_add_id);
			$(this).html("Αφαιρεση απο το προγραμμα της περιοδειας").removeClass("green").addClass("red");
			$("#tour_theaters").append("<div class='tour_theater' theater_id='" + theater_to_add_id + "'>" + theater_to_add_name + "</div>");
			activate_tour_theaters();
			activate_add_theater_button();
			$("#" + theater_to_add_id).addClass("added");
		})
	} else {
		$("#theater_button .button").html("Αφαιρεση απο το προγραμμα της περιοδειας").removeClass("green").addClass("red").unbind("click").click(function() {
			theaters_added_to_schedule.splice(theaters_added_to_schedule.indexOf(theater_to_add_id), 1);
			$(this).html("Προσθηκη στο προγραμμα της περιοδειας").removeClass("red").addClass("green");
			$("#tour_theaters").find("[theater_id='" + theater_to_add_id + "']").remove();			
			activate_add_theater_button();			
			$("#" + theater_to_add_id).removeClass("added");
		});
	}
}

function activate_tour_theaters() {
	$(".tour_theater").click(function() { $("#" + $(this).attr("theater_id")).removeClass("added"); if (theaters_added_to_schedule.indexOf($(this).attr("theater_id")) > -1) theaters_added_to_schedule.splice(theaters_added_to_schedule.indexOf($(this).attr("theater_id")), 1); $(this).remove(); activate_add_theater_button(); });
}

function activate_carousel() {
	clearInterval(carousel_interval);
	carousel_interval = null;
	carousel_interval = setInterval(function() { if ($('.carousel_image.visible').next().hasClass("carousel_image")) $('.carousel_image.visible').removeClass("visible").next().addClass("visible"); else $('.carousel_image.visible').removeClass("visible").parent().find(".carousel_image:first").addClass("visible"); },  3000);
}

function check_schedule() {
	current_schedule = theaters_added_to_schedule.sort();
	console.log(current_schedule);
	if (current_schedule.equals(correct_schedule)) alert("Σωστά!");
	else alert("Λάθος!");
}

function end_game() {
	
}
/* */


/* generic and external functions */
$.fn.extend({ 
	titlesBehaviour: function() {
		$(this).each(function() { $(this).mouseover(function() { ddrivetip($(this).attr("theTitle")); }); $(this).mouseout(function() { hideddrivetip(); }); });
	},
	disableSelection: function() { this.each(function() { this.onselectstart = function() { return false; }; this.unselectable = "on"; $(this).css('-moz-user-select', 'none'); $(this).css('-webkit-user-select', 'none'); }); return this; }
});
Array.prototype.equals = function (array) {
    if (!array) return false;
    if (this.length != array.length) return false;
    for (var i = 0, l=this.length; i < l; i++) { if (this[i] instanceof Array && array[i] instanceof Array) { if (!this[i].equals(array[i])) return false; } else if (this[i] != array[i]) { return false; } }       
    return true;
}   
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