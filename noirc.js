/*
	Node.js IRC Client
	Version: 0.0.1a
	Author: Elijah Cowley (GreyWolf)
	Owner: EPCIT
	Website: http://epcit.biz
	IRC Server: irc://irc.epcit.biz:6667
*/

// Required files
var net = require('net')
  , noircroutes = require('./routes/noircroutes.js')
  , express = require('express')
  , http = require('http')
  , url = require('url')
  , app = express.createServer()
  , colors = require('colors')
  , term = require('termhelper')

var config = {};
try {
	config = require('./noirc.config.js')
	if (!config) {
		console.log('Please remove the last two lines from noirc.config.js');
		process.exit(1);
	}
	if (config.kill) process.exit();
} catch (ex) {
	term.Writeln('Did you forgot to rename your config?')
	process.exit(1)
}

var noirclib = require('./lib/noirclib.js')
  , irc_server = require('./lib/' + config.irc.server_type + '.js')
  , locale = require('./locale/locale.' + config.app.language + '.js')
  , help = require('./help/help.' + config.app.language + '.js')

// Configure Node.js App
app.configure(function() {
  app.use(express.bodyParser());
  app.version = '0.0.1a';
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.static(__dirname + '/public'));
  app.set('view options', {
    layout: false
  });
});


// Get Pages
app.get('/', function(req, res) {
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  var id = irc.length
  , nick = ''
  , theme = 0
  , channels = 'default'
  , pass = ''
  , status = 'true';

  if (query.nickname) nick = query.nickname;

  if (query.channels && query.channels != 'default') channels = query.channels;
  if (query.theme != '0') theme = query.theme;
  if (query.status == 'false') status = 'false';

  connection[id] = ({
    id: id,
    nickname: nick,
    channels: channels,
    theme: theme,
    pass: pass,
    status: status,
  })
  if (nick != '') {
    res.render('chat');
  } else {
    res.render('index');
  }

});

/*
app.get('/chat', function(req, res) {
  //if (nick == '') {
   // res.redirect('/');
  //} else {
    res.render('chat');
  //}
});
*/

// Get POST data
app.post('/', function(req, res) {
  var url_parts = url.parse(request.url, true);
  var query = url_parts.query;
  var id = irc.length
  , nick = ''
  , theme = 0
  , channels = 'default'
  , pass = ''
  , status = true

  nick = req.body.nickname;

  if (req.body.channels != 'default') channels = req.body.channels;
  if (req.body.theme != '0') theme = req.body.theme;

  connection[id] = ({
    id: id,
    nickname: nick,
    channels: channels,
    theme: theme,
    pass: pass,
    status: status,
  })
  res.render('chat');
});

// Global Variables
var irc = new Array();
var io;
var connection = new Array();

// Start Express Server
app.listen(config.app.port);

// Output Server Start Message
console.log(ReplaceVars(locale.app_version + '\n' + locale.server_start));

// Setup Socket.IO
io = require('socket.io').listen(app);
io.set('log level', config.io.log_level);

// Socket.IO event handlers
io.sockets.on('connection', function(socket) {
  socket.emit('config', { site_allow: config.site.allow.join(',') });
  socket.emit('chat', { from: config.admin.nick, status: 'status request' });
  // Process User Commands
  socket.on('clientchat', function(data) {
    if (data.status && data.status == 'not connected') {
  //  if (connection[uid].nickname) {
      var uid = irc.length;
      // Connect User
      irc[uid] = {};
      socket.set('store', { irc_id: uid });
      socket.emit('chat', { from: config.admin.nick, irc_id: uid.toString(), connection: connection[uid], channel: 'status', notice: 'Connecting' });

      if (connection[uid].theme && connection[uid].theme != 0) socket.emit('chat', { setStyle: connection[uid].theme });
      if (connection[uid].status) socket.emit('chat', { setStatus: connection[uid].status });

      if (connection[uid]) connect(uid, connection[uid], socket);
      else socket.emit('chat', { from: config.admin.nick, irc_id: uid.toString(), connection: connection[uid], channel: 'status', notice: 'Error connecting' });
    } else if (data.status && data.status == 'connected') {
      // Send Disconnected Message To User (allows user to reconnect without page refresh)
      socket.emit('chat', { from: config.admin.nick, channel: 'status', notice: 'Disconnected' });
    } else if (data.irc_id) {
      var id = parseInt(data.irc_id);
      if (config.app.debug == true) { console.log("IRC ID: " + data.irc_id); term.Prompt(); }

      if (data.notice && data.notice == config.admin.nick && irc[id]) {
        // Auto Reconnect User
        irc.splice(id,1);
        var uid = irc.length;
        irc[id] = {};
        //connection[data.id].nickname = data.connection[data.id].nickname
        if (connection[uid].status) socket.emit('chat', { setStatus: connection[uid].status });
        connect(id, connection[uid], socket);
      } else if (data.raw && data.raw == 'QUIT' && data.message && data.message != '' && irc[id]) {
        // Quit IRC
        irc[id].send(irc[id].socket, data.message);
        irc[id].socket.destroy();
        irc.splice(id,1);
      } else if (data.raw && data.raw == 'PONG' && data.message && data.message != '' && irc[id]) {
        irc[id].send(irc[id].socket, 'PONG ' + data.message);
      } else if (data.channel != 'status' && data.notice && data.notice != '' && irc[id]) {
        // Send IRC Notice
        irc[id].send(irc[id].socket, 'NOTICE ' + data.channel + ' ' + data.notice);
      } else if (data.channel != 'status' && data.message && data.message.substr(0,1) != '/' && irc[id]) {
        // Send IRC Private Message
        irc[id].send(irc[id].socket, 'PRIVMSG ' + data.channel + ' ' + data.message);
      } else if (data.channel != 'status' && data.action && data.action != '' && irc[id]) {
        // Send IRC Private Message
        irc[id].send(irc[id].socket, 'PRIVMSG ' + data.channel + ' \u0001ACTION ' + data.action + '\u0001');
      } else if (data.message && irc[id]) {
        // Send Other Commands
        var message = data.message;
        if (message.substr(0,1) == '/') message = message.substr(1);
        irc[id].send(irc[id].socket, message);
      } else if (data.channel != 'status' && data.raw && data.raw == 'JOIN' && irc[id]) {
        // Join Channel
        irc[id].send(irc[id].socket, 'JOIN ' + data.channel);
      } else if (data.channel != 'status' && data.raw && data.raw == 'PART' && irc[id]) {
        // Part Channel
        irc[id].send(irc[id].socket, 'PART ' + data.channel);
      } else if (data.raw && data.raw != '' && data.nick && data.nick != '' && irc[id]) {
        irc[id].send(irc[id].socket, data.raw + ' ' + data.nick);
      }
    }
  });
/*
  socket.on('disconnect', function() {
    console.log(socket.store.irc_id);
    irc[socket.store.irc_id].socket.destroy();
    irc.splice(socket.store.irc_id,1);
  });
*/
});

// start emitting keypress events
//keypress(process.stdin);
process.stdin.setEncoding(config.app.encoding);

term.set({ debug: false, prompt: locale.prompt });
term.on('line',ProcessInput);

term.Prompt();

// Process STDIN
//process.stdin.on('data',
function ProcessInput(data) {
  // Clear Console
  if (data == 'clear\n') {
    term.Write('\u001B[2J\u001B[0;0f');
    term.Writeln(ReplaceVars(locale.app_version));
  }
  // Show Users Count
  if (data == 'users\n') term.Writeln(ReplaceVars(locale.users));
  // Straight Close Command Exits App
  if (data.substr(0,6) == 'close\n') {
    irc.forEach(function(con) {
      if (con) {
        irc[con.id].io.emit('chat', { from: config.admin.nick, channel: 'status', notice: locale.connection_kill });
        irc[con.id].io.disconnect();
        //irc[con.id].socket.destroy();
        irc.splice(con.id,1);
      }
    });
    process.exit();
  }
  // Close A Connection By ID
  if (data.substr(0,6) == 'close ') {
    var users = data.substr(6).replace('\n','');
    if (users == '*' || users == '-1') {
      // Close All Connections
      irc.forEach(function(con) {
        irc[con.id].io.emit('chat', { from: config.admin.nick, channel: 'status', notice: locale.connection_kill });
        irc[con.id].io.disconnect();
        //irc[con.id].socket.destroy();
        irc.splice(con.id,1);
      });
    } else if (users.indexOf(' ') !== -1) {
      // Close Multiple Connections
      var ul = users.split(' ');
      ul.forEach(function(u) {
		u = parseInt(u)
        irc[u].io.emit('chat', { from: config.admin.nick, channel: 'status', notice: locale.connection_kill });
        irc[u].io.disconnect();
        //irc[u].socket.destroy();
        irc.splice(u,1);
      });
    } else {
      // Close Single Connection
      var u = parseInt(users);
      irc[u].io.emit('chat', { from: config.admin.nick, channel: 'status', notice: locale.connection_kill });
      irc[u].io.disconnect();
      irc[u].socket.destroy();
      irc.splice(u,1);
    }
    // Output User Count
    console.log(ReplaceVars(locale.users));
  }
  // Close A Connection By IRC Nickname
  if (data.substr(0,4) == 'kill') {
    var users = data.substr(5).replace('\n','');
    if (users == '*') {
      // Close All Connections
      irc.forEach(function(con) {
        irc[con.id].io.emit('chat', { from: config.admin.nick, channel: 'status', notice: locale.connection_kill });
        irc[con.id].io.disconnect();
        irc[con.id].socket.destroy();
        irc.splice(con.id,1);
      });
    } else if (users.indexOf(' ') !== -1) {
      // Close Multiple Connections
      var ul = users.split(' ');
      ul.forEach(function(u) {
        irc.forEach(function(con) {
          if (con.nickname == u) {
            irc[con.id].io.emit('chat', { from: config.admin.nick, channel: 'status', notice: locale.connection_kill });
            irc[con.id].io.disconnect();
            irc[con.id].socket.destroy();
            irc.splice(con.id,1);
          }
        });
      });
    } else {
      // Close Single Connection
      irc.forEach(function(con) {
        if (con.nickname == users) {
          irc[con.id].io.emit('chat', { from: config.admin.nick, channel: 'status', notice: locale.connection_kill });
          irc[con.id].io.disconnect();
          irc[con.id].socket.destroy();
          irc.splice(con.id,1);
        }
      });
    }
    // Output User Count
    console.log(ReplaceVars(locale.users));
  }
  // Toggle Debug Mode
  if (data == 'debug\n') {
    if (config.app.debug == true) {
      config.app.debug = false;
      term.Writeln(locale.labels.debug + locale.values.off);
    } else {
      config.app.debug = true;
      term.Writeln(locale.labels.debug + locale.values.on);
    }
  }
  // Change Prompt
  if (data.substr(0,6) == 'prompt') {
    locale.prompt = data.substr(7).replace('\n','');
    term.set('prompt', locale.prompt);
  }
  // List Online Users
  if (data == 'list\n') {
    irc.forEach(function(con) {
      term.Writeln('[' + con.id + ']' + con.nickname + ': ' + con.io.handshake.address.address);
    });
  }
  // Output Node.js IRC Version
  if (data == 'version\n') term.Writeln(lib.version);
  // Output NoIRC Owner
  if (data == 'owner\n') term.Writeln(lib.owner);
  // Output Node.js IRC Author
  if (data == 'author\n') term.Writeln(lib.author);
  // Exit Node.js IRC
  if (data == 'quit\n' || data == 'exit\n') process.exit();
  // Output Node.js IRC Help
  if (data.substr(0,4) == 'help') {
    term.Writeln(noirclib.getHelp(data.substr(4)))
  }
  // Output Prompt
  term.Prompt();
}//);

// Connect A User To IRC
function connect(id, con, iosock) {
  // Set Per User Variables
  irc[id].id = id;
  irc[id].server = config.irc.server;
  irc[id].port = config.irc.port;
  irc[id].pass = con.pass;
  irc[id].type = '';

  irc[id].nickname = con.nickname;
  irc[id].username = config.irc.username;

  // Set Channels To Join On Connect
  if (con.channels == 'default') irc[id].channels = config.irc.default_channels;
  else if (channels.indexOf(' ') !== -1) irc[id].channels = con.channels.split(' ');
  else if (channels.indexOf(',') !== -1) irc[id].channels = con.channels.split(',');
  else irc[id].channels = con.channels.split();

  irc[id].chantypes = '';
  irc[id].theme = con.theme;

  // Store Users Socket.IO Connection
  irc[id].io = iosock;

  // Create Users Net.Socket
  irc[id].socket = new net.Socket();
  irc[id].socket.setEncoding(config.socket.encoding);
  irc[id].socket.setNoDelay();
  irc[id].socket.irc_id = id;

  // Connect To IRC Server
  irc[id].socket.connect(irc[id].port, irc[id].server);

  // Bind User Functions
  irc[id].send = function(sock,msg) {
    sock.write(msg + '\n\r');
    if (config.app.debug == true) { term.Writeln("<"+sock.remoteAddress + ":" + sock.remotePort+"> " + msg); term.Prompt(); }
  };

  irc[id].put = function(msg) {
    this.io.emit('chat', msg);
  }.bind(irc[id]);

  // Bind User Event Handlers
  irc[id].socket.on('connect', onConnect.bind(irc[id]));
  irc[id].socket.on('data', onData.bind(irc[id]));
  irc[id].socket.on('close', function (socket) {
    if (config.app.debug == true) { term.Writeln(locale.labels.disconnect); term.Prompt(); }
    if (irc[this.id]) irc[this.id].io.disconnect();
  }.bind(irc[id]));
  irc[id].socket.on('error', function () {
    if (config.app.debug == true) term.Writeln(locale.error.connect);
  }.bind(irc[id]));

  irc[id].io.on('disconnect', function() {
    if (irc[this.id]) {
      irc[id].send(irc[id].socket, 'QUIT ' + config.irc.quit_message)
      //irc[this.id].socket.destroy();
      irc.splice(this.id,1);
    }
  }.bind(irc[id]));

}

// Connect Event Handler Method
function onConnect() {
  if (config.app.debug == true) term.Writeln(this.nickname + " " + locale.labels.connect);
  setTimeout(function() {
    if (this.pass != '') this.send(this.socket, 'PASS ' + this.pass);
    this.send(this.socket, 'NICK ' + this.nickname);
    this.send(this.socket, 'USER ' + this.username + ' 8 * :' + config.irc.client);
    // add alt-nick here
  }.bind(this), 500);
}

// Net Socket Data Event Handler Method
function onData(data) {
  var adata = data.split(config.socket.lineEnd);
  adata.forEach(function(data) {
    var echo = true;

    // Process IRC Server Messages
    idata = irc_server.interpret(data.toString(), irc[this.id]);

    if (idata.type) irc[this.id].type = idata.type;
    if (idata.chantypes) irc[this.id].chantypes = idata.chantypes.split();

    if (idata.raw == 266) {
      setTimeout(function() {
        for (var i = 0; i < this.channels.length; i++) {
          this.send(this.socket, "JOIN " + this.channels[i]);
          if (config.app.debug == true) { term.Writeln("JOIN " + this.channels[i]);  term.Prompt(); }
        }
      }.bind(irc[this.id]), 1000);
    }

    if (idata.prefix && idata.prefix != '') {
      var p = idata.prefix.substr(1).split(')');
      irc[this.id].prefix = {
        modes: p[0].split(''),
        symbols: p[1].split(''),
        names: ['owner','protected','operator','halfop','voice']
      }
    }

    /*
    	Send Ping Reply To IRC Server (set echo to true to pass the ping to the user)
    */
    //if (idata.raw == "PING") {
    //  echo = false;
    //  this.send(this.socket, "PONG " + idata.msg);
    //}

    // Output Debug Message (comment first and remove comment on second line to display post-processed messages)
    if (config.app.debug == true) { term.Writeln(data); term.Prompt(); } // Show Entire Server Message
    //if (config.app.debug == true && echo == true && idata.msg != '' && idata.msg != ' ') console.log(idata.raw + ': <' + idata.channel + '> ' + idata.msg);

    // Send Data To User
    if (echo == true) {
      sendval = idata;
      if (irc[this.id]) {
      if (this.nickname) sendval.mynick = this.nickname;
      if (irc[this.id].prefix) sendval.prefix = irc[this.id].prefix;
      if (irc[this.id].chantypes) sendval.chantypes = irc[this.id].chantypes;
        if (sendval.raw != '000' || sendval.message != '' || sendval.notice != '' || sendval.topic != '' || sendval.topic_setby != '') {
          irc[this.id].put(sendval);
          if (config.app.debug == true) { term.Writeln(sendval); term.Prompt(); }
        }
      }
    }
  }.bind(this));
}

// Replace Variables In Strings ( variables take the form %var% )
function ReplaceVars(data) {
  if (data.indexOf('%users%') !== -1 && irc.length > 99) data = data.replace('%users%', irc.length.toString().green);
  else if (data.indexOf('%users%') !== -1 && irc.length > 0) data = data.replace('%users%', irc.length.toString().yellow);
  else if (data.indexOf('%users%') !== -1 && irc.length == 0) data = data.replace('%users%', irc.length.toString().red);
  if (data.indexOf('%port%') !== -1) data = data.replace('%port%', config.app.port);
  if (data.indexOf('%version%') !== -1) data = data.replace('%version%', app.version);
  return data;
}
