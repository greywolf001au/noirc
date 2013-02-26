/*
	Node.js IRC Client Script
	Author: Elijah Cowley (GreyWolf)
	Owner: EPCIT
	Website: http://epcit.biz
	IRC Server: irc://irc.epcit.biz:6667
*/

var socket = io.connect();
var current_tab = 'status';
var current_style = 0;
var status = 'not connected';
var menu_nick = '';
var myconnection;
var irc = {
  id: '',
  nick: '',
  chantypes: ['#'],
  prefix: {
    modes: [],
    symbols: [],
    names: ['owner','protected','operator','halfop','voice'],
    image_artists: ['','','','http://p.yusukekamiyamane.com/']
  },
  channels: [],
}
var config = {
  site: {
    allow: [],
  }
}

$(window).load(function() {
  $("#status").toggle('fast');
});

$(document).ready(function() {
	$("#theme").change(function() {
		document.styleSheets[current_style].disable = true;
		current_style = $('#theme').val()
		document.styleSheets[current_style].disabled = false;
	});
	$('.rc_menuitem').click(function() {
		$('.rc_menu').slideToggle('fast');
	});
	$('#sendtext').keydown(function(e) {
		if (e.keyCode == 13) $("#sendbtn").trigger('click');
	});
	$('#sendbtn').click(function() {
		var omsg = $('#sendtext').val();
		var msg = '';
		var a = null;
/*
try {
  a = eval(omsg)
  print(current_tab,a.toString());
} catch (ex) {
  console.log(ex);
}
*/
		if (omsg.substr(0,1) == '/') a = ProcessAliases(omsg.substr(1, omsg.indexOf(' ') - 1));
		if (a != null) msg = a + omsg.substr(omsg.indexOf(' '));
		else msg = omsg
		if (msg.substr(0,1) == '/') msg = msg.substr(1);
		if (omsg.substr(0,1) == '/') omsg = omsg.substr(1);

		if (contains_key(alias,msg.split(' ')[0]) == false)//.substr(0,4) != 'ECHO' && msg.substr(0,5) != 'PRINT')
			socket.emit('clientchat', { irc_id: irc.id.toString(), raw: a, channel: current_tab.replace('_',irc.chantypes[0]), message: msg});

		if (msg != '') {
			var echo;
			no_output.forEach(function(data) {
				var p = msg.split(' ');
				p.pop();
				if (p.join(' ').toLowerCase() == data) echo = false;
			});
			var onick = '&lt;' + irc.nick + '&gt; ';
			if (msg.substr(0,4) == 'ECHO') {
				msg = msg.substr(msg.indexOf(' ')+1);
				print(msg.substr(0, msg.indexOf(' ')), msg.substr(msg.indexOf(' ', msg.indexOf(' '))) + "<br>\n");
				//$('#' + current_tab).children('.channel_window').append(omsg);
				//scrollWindow(current_tab);
			} else if (msg.substr(0,5) == 'PRINT') {
				msg = msg.substr(msg.indexOf(' ')+1);
				print(msg.substr(0, msg.indexOf(' ')), msg.substr(msg.indexOf(' ', msg.indexOf(' '))));
				//omsg = msg.substr(msg.indexOf(' ')+1);
				//$('#' + current_tab).children('.channel_window').append(omsg);
				//scrollWindow(current_tab);
			} else if (msg.split(' ')[0] == 'is_op') {
				print(eval(msg))
			} else if (echo != false) {
				$('#' + current_tab).children('.channel_window').append(onick + omsg + "<br>\n");
				scrollWindow(current_tab);
			}
		}
		$('#sendtext').val('');
	});
	$('.channel_tab').click(function() {
		ChanTabClick($(this).prop('id').substr(4));
	});
	socket.on('config', function(data) {
		if (data.site_allow) config.site.allow = data.site_allow.split(',');
		//alert(data.site_allow)
	});
	socket.on('chat', function(data) {
		if (data.connection) {
			myconnection = data.connection;
			status = 'connected';
		}

		if (data.irc_id) irc.id = data.irc_id;

		if (data.status == 'status request')
			socket.emit('clientchat', { status: status, channel: 'status' });

		if (data.setStyle) {
			document.styleSheets[current_style].disable = true;
			current_style = data.setStyle;
			if (current_style == '') current_style = '0';
			$('#theme').val(current_style)
			document.styleSheets[current_style].disabled = false;
		}
		if (data.setStatus && data.setStatus == 'false') {
			$("#status").hide('fast');
			$("#tab_status").hide('fast');
			current_tab = '';
			$('#smsg').show('fast');
			//alert('Status disabled');
		}

		if (data.raw == 'PING') socket.emit('clientchat', { irc_id: irc.id.toString(), raw: 'PONG', message: data.message });

		if (data.chantypes) irc.chantypes = data.chantypes;
		if (data.prefix) {
			irc.prefix = data.prefix;
			//alert(data.prefix);
		}

		var chanid = 'status';
		if (data.channel) chanid = data.channel.replace(irc.chantypes[0],'_');

		if (data.mynick) irc.nick = data.mynick;

		if ($('#' + chanid).length === 0 && chanid != irc.nick && chanid != 'AUTH' && data.raw != 'PART') {
			irc.channels[data.channel] = [];
			for (var i = 0; i < irc.prefix.modes.length; i++) {
				irc.channels[data.channel][irc.prefix.modes[i]] = [];
			}
			CreateWindow(data.channel);
			if (current_tab == '') ChanTabClick(chanid);
		}

		if (data.mode && data.mode != '' && chanid != 'status') {
			var ul = [];
			var ml = [];
			if (data.users.indexOf(' ') == -1) ul = data.users.split();
			else ul = data.users.split(' ');
			ml = data.mode.substr(1).split('');
			for (var h = 0; h < ul.length; h++) {
				var el = $('#username-' + chanid + '_' + ul[h]);
				var mid = -1;
				for (var i = 0; i < irc.prefix.modes.length; i++) {
					if (irc.prefix.modes[i] == ml[h]) {
						mid = i;
					}
				}
				if (data.mode.substr(0,1) == '+' && mid > -1) {
				el.html('<img class="channel_mode" src="/images/' + irc.prefix.names[mid] + '.png" alt="' + irc.prefix.symbols[mid] + '">' + el.html());
					irc.channels[chanid][irc.prefix.modes[mid]].push(un)
				} else {//if (data.mode.substr(0,1) == '-' && mid > -1)
				el.children('.channel_mode').remove();
					for (var m = 0; m < irc.channels[chanid][irc.prefix.modes[mid]].length; m++) {
						if (irc.channels[data.channel][irc.prefix.modes[mid]][m] == un) irc.channels[chanid][irc.prefix.modes[mid]].splice(m,1)
					}
				}
			}
		}

		if (data.topic && data.topic != '') {
			$('#' + chanid).children('.channel_topic').html(data.topic);
		}

		if (data.topic_setby && data.topic_setby != '') {
			var topic = data.topic_setby.split(' ')[0];

			var date = new Date(parseInt(data.topic_setby.split(' ')[1]) * 1000);
			var topicelem = $('#' + chanid).children('.channel_topic');
			var elem = $('#' + chanid).children('.channel_window');
			elem.html('· Topic · ' + topicelem.html() + ' [Set by ' + topic + ' on ' + date.toString() + ']<br>\n');
		}

		if (!data.mode && data.users && data.users != '') {
			var userHtml = '';
			var users = data.users.split(' ').sort(function (a,b){ return a.localeCompare(b) });
			for (var i=0; i < users.length; i++) {
				var un = users[i];
				var cmi = '';
				for (var j = 0; j < irc.prefix.symbols.length; j++) {
					if (un.substr(0,1) == irc.prefix.symbols[j]) {
						un = un.replace(irc.prefix.symbols[j],'');
						cmi = '<img class="channel_mode" src="/images/' + irc.prefix.names[j] + '.png" alt="' + irc.prefix.symbols[j] + '">';
					}
				}
				userHtml += '<div class="channel_name" id="username-' + chanid + '_' + un + '" onmousedown="RCMenu(event,\'' + un + '\');">' + cmi + un + '</div>';
			}
			$('#' + chanid).children('.channel_names').html(userHtml);
		}

		if (data.raw && data.raw == 'JOIN' && data.from && data.from != '' && chanid != '' && chanid != 'status') {
			var userHtml = '<div class="channel_name" id="username-' + chanid + '_' + data.from + '" onmousedown="RCMenu(event,\'' + un + '\');">' + data.from + '</div>';			
			$('#' + chanid).children('.channel_names').append(userHtml);
			$('#' + chanid).children('.channel_window').append(data.message + "<br>");
		}
		if (data.raw && data.raw == 'PART' && data.from && data.from != '' && data.channel && data.channel != '') {
			$('#username-' + data.channel + '_' + data.from).remove();
			$('#' + chanid).children('.channel_window').append(data.message + "<br>");
		}
		if (data.raw && data.raw == 'QUIT' && data.from && data.from != '') {
			for (var chan in irc.channels) {
			  //alert(chan + ' '+data.message);
			  $('.channel_names').children('#username-' + chan.replace(irc.chantypes[0],'_') + '_' + data.from).remove();
			  $('#' + chan.replace(irc.chantypes[0],'_')).children('.channel_window').append(data.message + "<br>");
			}
		}

		if (data.raw == 'PRIVMSG' && data.channel == irc.nick && data.message == 'VERSION') {
			socket.emit('clientchat', { irc_id: irc.id.toString(), channel: data.from, notice: 'VERSION NoIRC v0.0.1a running on Node.js on Debian Linux' });
		} else if (data.message && data.message != '' && (!data.raw || data.raw != 'PING' && data.raw != 'JOIN')) {
			var from = '';
			if (data.from && data.from != '') from = '&lt;' + data.from + '&gt; ';
			$('#' + chanid).children('.channel_window').append(from + data.message + "<br>");
		}
		if (data.notice && data.notice != '') {
			var from = '';
			if (data.from && data.from == 'node.js' && data.notice == 'Disconnected') {
				socket.emit('clientchat', { irc_id: irc.id.toString(), connection: myconnection, nickname: irc.nick, notice: 'Reconnect', channel: 'status' });
			} else if (data.from && data.from != '') {
				from = '&lt;' + data.from + '&gt; ';
				$('#' + current_tab).children('.channel_window').append('<span class="notice">from ' + from + '</span> ' + data.notice + "<br>");
			}
		}
		// scroll to bottom of window
		scrollWindow(chanid);
/*
		if (data.username) {
			$('#users').append('<span class="label label-success" id="username-' + data.username + '">' + data.username + '</span>');
		}
	});
	socket.on('disconnect', function (data) {
		$('#username-' + data.username).remove();
*/
	});
});
var no_output = new Array();
no_output.push('privmsg nickserv identify');
no_output.push('privmsg chanserv identify');
no_output.push('privmsg ns identify');
no_output.push('privmsg cs identify');

function msg(msg) {
	var onick = '&lt;' + irc.nick + '&gt;';
	var omsg = ReplaceVars(msg)
	socket.emit('clientchat', { irc_id: irc.id.toString(), channel: '', message: omsg });
	$('#' + current_tab).children('.channel_window').append(onick + omsg.substr(omsg.indexOf(' ')+1) + "<br>\n");
	scrollWindow(current_tab);
}
function me(msg) {
	var onick = irc.nick + ' > ';
	var omsg = ReplaceVars(msg)
	socket.emit('clientchat', { irc_id: irc.id.toString(), channel: current_tab.replace('_',irc.chantypes[0]), action: omsg });
	$('#' + current_tab).children('.channel_window').append(onick + omsg + "<br>\n");
	scrollWindow(current_tab);
}
function notice(msg) {
	socket.emit('clientchat', { irc_id: irc.id.toString(), channel: '', message: ReplaceVars(msg) });
}
function whoisClick() {
	if (menu_nick != '') {
		Whois(menu_nick);
		menu_nick = '';
	}
	$('.rc_menu').slideToggle('fast');
}
function versionClick() {
	if (menu_nick != '') {
		Version(menu_nick);
		menu_nick = '';
	}
	$('.rc_menu').slideToggle('fast');
}
function Whois(nick) {
	socket.emit('clientchat', { irc_id: irc.id.toString(), raw: 'WHOIS', nick: nick });
}
function Version(nick) {
	socket.emit('clientchat', { irc_id: irc.id.toString(), raw: 'PRIVMSG', channel: nick, message: 'VERSION' });
}
function ProcessAliases(func) {
	if (alias[func]) return alias[func];
	return null;
}
function RCMenu(e, nick) {
	if (!e) e = window.event;
	var posx = 0, posy = 0;
	if (e.pageX || e.pageY) {
		posx = e.pageX;
		posy = e.pageY;
	} else if (e.clientX || e.clientY) {
		posx = e.clientX;
		posy = e.clientY;
	}
	$('.rc_menu').css('left',posx + 20);
	$('.rc_menu').css('top',posy);
	$('.rc_menu').slideToggle('fast');
	if ($('.rc_menu').css('display') != 'none') menu_nick = nick;
	else menu_nick = '';
}
function print(winid,msg) {
	//alert(winid + ':' + msg);
	$('#' + winid).children('.channel_window').append(msg);
	scrollWindow(winid);
}
function scrollWindow(winid) {
	var myDiv = $("#" + winid).children('.channel_window');
	myDiv.animate({ scrollTop: myDiv.prop("scrollHeight") }, 10);
}
function ChanTabClick(id) {
	$('#' + current_tab).toggle('fast');
	$('#tab_' + current_tab).removeClass('selected_tab');

	current_tab = id; //.substr(4);
	$('#' + current_tab).toggle('fast');
	$('#tab_' + current_tab).addClass('selected_tab');
	scrollWindow(current_tab);
}
function is_founder(chan, nick) {
	for (var m = 0; m < irc.channels[chan][irc.prefix.modes[0]].length; m++) {
		if (irc.channels[chan][irc.prefix.modes[0]][m] == nick) return true;
	}
	return false;
}
function is_op(chan, nick) {
	for (var m = 0; m < irc.channels[chan][irc.prefix.modes[1]].length; m++) {
		if (irc.channels[chan][irc.prefix.modes[1]][m] == nick) return true;
	}
	return false;
}
function is_hop(chan, nick) {
	for (var m = 0; m < irc.channels[chan][irc.prefix.modes[2]].length; m++) {
		if (irc.channels[chan][irc.prefix.modes[2]][m] == nick) return true;
	}
	return false;
}
function is_voice(chan, nick) {
	for (var m = 0; m < irc.channels[chan][irc.prefix.modes[3]].length; m++) {
		if (irc.channels[chan][irc.prefix.modes[3]][m] == nick) return true;
	}
	return false;
}

function Join(chan) {
	socket.emit('clientchat', { irc_id: irc.id.toString(), raw: 'JOIN', channel: chan.replace('_',irc.chantypes[0]) });
	CloseWindow(chan);
}
function Part(chan) {
	socket.emit('clientchat', { irc_id: irc.id.toString(), raw: 'PART', channel: chan.replace('_',irc.chantypes[0]) });
	CloseWindow(chan);
}
function CreateWindow(name) {
	var id = name.replace(irc.chantypes[0],'_');
	$('.chantabs').append("<span class='channel_tab' id='tab_" + id + "'><a onclick='ChanTabClick(\"" + id + "\");'>"+name+"</a> <img class='closebtn' onclick='Part(\""+id+"\");' alt='x' title='Close'></span>");
	$('.window_set').append("<div id='"+id+"' class='channel_set'><div class='channel_topic'></div><div class='channel_window'></div><div id='members_"+id+"' class='channel_names'></div></div>\r\n");
	if ($('#smsg').css('display') != 'none') $('#smsg').hide('fast');
}
function CloseWindow(name) {
	if (current_tab == name) ChanTabClick('status');
	$('#tab_' + name).remove();
	$('#' + name).remove();
}
function ReplaceVars(msg) {
	msg = msg.replace('$snick',menu_nick);
	msg = msg.replace('$chan',current_tab.replace('_',irc.chantypes[0]));
	msg = msg.replace('$nick',irc.nick);
	return msg;
}

function in_array(haystack, needle) {
	for (var x in haystack) {
		if (haystack[x] === needle) return true;
	}
	return false;
}

function contains_key(haystack, needle) {
	for (var x in haystack) {
		alert(x + ':' + needle)
		if (x === needle) return true;
	}
	return false;
}
//window.addEventListener("message", receiveMessage, false);

