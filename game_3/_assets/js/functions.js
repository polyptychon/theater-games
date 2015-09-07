/* global vars */
var isIE = $.browser.msie;
var isIE8 = $.browser.msie && ($.browser.version.indexOf(8) != -1);
var isIE9 = $.browser.msie && ($.browser.version.indexOf(9) != -1);
/* */

/* window/document states */
$(window).ready(function() {
	if (isIE8 || isIE9) {
		$("body").html("<div id='ie_message'>This site uses web technologies that your browser (Internet Explorer " + $.browser.version + ") doesn't support.<br/>Please visit the site using a new version of <a href='https://www.google.com/intl/en/chrome/browser/'>Google Chrome</a>, <a href='http://www.mozilla.org/en-US/firefox/new/'>Mozilla Firefox</a>, <a href='https://www.apple.com/safari/'>Safari</a> or <a href='http://www.opera.com/'>Opera</a>.<br/>Sorry for the inconvenience :-/</div>");
	} else {
		setTimeout(function() { $("#loader").fadeOut(250, function() { $(this).remove(); }); }, 250);			
	}
});
/* */

/* generic functions */
String.prototype.capitalize = function() { return this.charAt(0).toUpperCase() + this.slice(1); }
String.prototype.firstCap = function() { return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase(); }
function getConfirmation(action,message) { var confirmation=window.confirm(message); if (confirmation) eval(action); else return false; }
function scrollToAnchor(name,duration) { if (name == "") $("html,body").stop().animate({ scrollTop: 0 }, duration, 'easeInOutExpo'); else $('html,body').stop().animate({ scrollTop: $("a[name='" + name + "']").offset().top - 10 + "px" }, duration, 'easeInOutExpo'); }
/* */