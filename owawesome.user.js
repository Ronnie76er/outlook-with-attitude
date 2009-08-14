// ==UserScript==
// @name           OWAwesome
// @namespace      http://takeo.info
// @description    An attempt to make OWA bearable, and maybe even awesome
// @author         Toby Sterrett
// @include        *your.exchange-server.com*
// ==/UserScript==

// Add jQuery
var GM_JQ = document.createElement('script');
GM_JQ.src = 'http://code.jquery.com/jquery-latest.js';
GM_JQ.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(GM_JQ);

// Check if jQuery's loaded
function GM_wait() {
  if (typeof unsafeWindow.jQuery == 'undefined') { 
    window.setTimeout(GM_wait,100);
  } else { 
    $ = unsafeWindow.jQuery;
	letsJQuery();
  }
}

GM_wait();

// All your GM code must be inside this function
function letsJQuery() {
  
  // hotkeys plugin courtesey of defunkt
  $.hotkeys = function(options) {
    for(key in options) $.hotkey(key, options[key])
    return this
  }

  // set up some special keys
  $.hotkeys.specialKeys = {'esc': 27, 'enter': 13, 'alt+s': 1083, 'alt+w': 1087, 'shift+i': 2073, 'shift+u': 2085}

  // accepts a function or url
  $.hotkey = function(key, value) {
     if ($.hotkeys.specialKeys[key] != null) {
       key = $.hotkeys.specialKeys[key]
     } else {
       charcode = key.charCodeAt(0)
       key = (charcode >= 48 && charcode <= 57) ? charcode : (charcode - 32)
     }
    $.hotkeys.cache[key] = value
    return this
  }

  $.hotkeys.cache = {}

  $('a[hotkey]').each(function() {
    $.hotkey($(this).attr('hotkey'), $(this).attr('href'))
  })

  //$(document).bind('keydown.hotkey', function(e) {
  $(document).bind('keydown', function(e) {
	// debug using firebug
	console.log("keyCode: " + e.keyCode);
	// don't hotkey when typing in an inputs
    if ($(e.target).is(':input')) {
		if (!e.altKey) return;
	}

    // some modifiers not supported 
    if (e.ctrlKey || e.metaKey) return true

	var lookup = (e.altKey) ? e.keyCode + 1000 : e.keyCode;
	lookup = (e.shiftKey) ? lookup + 2000 : lookup;
    var el = $.hotkeys.cache[lookup];
    if (el) {
		if ($.isFunction(el)) {
			e.preventDefault();
			el.call(this);
		} else {
			//window.location = el;
		}
	}
  })
  // end hotkeys plugin
  
  $.nav = {}
  
  $.nav.subfolder = function(title) {
    if ($('a[title=' + title + ']'))
      return $('a[title=' + title + ']').attr('href')
    else
      return false
  }
  
  $.nav.activeTab = function() {
    return $('a.pn.s').attr('title')
  }
  
  var records = $('table.lvw > tbody > tr:visible:not(:has(th, td.ohdv))')
      
  $.nav.go = function(direction) {
    if (records.length < 1) return false
    var current = $('tr[current=current]')
    var i = records.index(current)
    i = direction == 'prev' ? i-1 : i+1
    if (current) current.removeAttr('current').find('td').css('background-color', 'transparent')
    $(records[i]).attr('current','current').find('td').css('background-color','#fc3')
  }
  
  $.nav.open = function() {
    if ($('tr[current=current] a').length < 1) return false
    return document.location = $('tr[current=current] a').click().attr('href')
  }
  
  $.nav.page = function(dir) {
    if ($('img[title*=' + dir + ']').length > 0) return $($('img[title*=' + dir + ']')[0]).parent().click()
    if ($('td.nv a[title*=' + dir + ']').length > 0) return $('td.nv a[title*=' + dir + ']').click()
  }
  
  $.nav.click = function(btn) {
    return $('a.btn[title=' + btn + ']').click()
  }
  
  $.nav.esc = function() {
    $.nav.click('Close')
    $.nav.click('Cancel')
    $('tr[current=current]')
      .removeAttr('current')
      .find('td')
      .css('background-color','transparent')
  }
      
  $.hotkeys({
    'enter': function() { $.nav.open() },
    'esc': function() { $.nav.esc() },
    '1': function() { $('a[title=Mail]').click() },
    '2': function() { $('a[title=Calendar]').click() },
    '3': function() { $('a[title=Contacts]').click() },
    'a': function() { $.nav.click('Reply to All') },
    'c': function() { $.nav.click('Check Messages') },
    'd': function() { $.nav.click('Delete') },
    'e': function() { $.nav.click('Empty Deleted Items Folder') },
    'f': function() { $('#txtSch').focus() },
    'h': function() { $.nav.page('Previous') },
    'j': function() { $.nav.go('next') },
    'k': function() { $.nav.go('prev') },
    'l': function() { $.nav.page('Next') },
    'm': function() { $.nav.click('Move') },
    'n': function() { $('a.btn[title*=New]').click() },
    'q': function() { $.nav.click('Close') },
    'r': function() { $.nav.click('Reply') },
    'u': function() { $.nav.click('Junk') },
    'v': function() { $.nav.click('Check Names') },
    'w': function() { $.nav.click('Forward') },
    'x': function() { $('tr[current=current] :checkbox').click() },
    'alt+s': function() { $.nav.click('Send') },
    'alt+w': function() { $.nav.click('Save') },
    'shift+i': function() { $.nav.click('Mark as Read') },
    'shift+u': function() { $.nav.click('Mark as Unread') }
	})
}

letsJQuery()
