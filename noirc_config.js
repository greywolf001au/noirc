/*
	Node.js IRC Configuration File
	Author: Elijah Cowley (GreyWolf)
	Owner: EPCIT
	Website: http://epcit.biz
	IRC Server: irc://irc.epcit.biz:6667
*/

module.exports = {
  // Application settings
  app: {
    port: 3000,									// Express Server Port (website hosting port)
    debug: false,								// Output Debug Messages
//    encoding: 'utf8',							// Character Encoding For STDIN (Console Input)[not yet available, see README.md]
    language: 'en',								// Locale Language
  },
  // IO Settings
  io: {
    log_level: 1								// Sets the logging level for website socket connections
  },
  // Net Socket Settings
  socket: {
    encoding: 'ascii',							// Net.Socket Encoding (Net.Socket Connects To IRC Server)
    lineEnd: '\r\n',
  },
  // IRC Settings
  irc: {
    server_type: 'unreal32',					// IRC Server Type (Message Processor)
    server: 'irc.epcit.biz',					// IRC Server Address To Connect To
    port: 6667,									// IRC Server Port To Connect On
    username: 'nodejs_client',					// Username To Pass To IRC Server
    client: 'Node.js IRC client',				// Client Description			
    default_channels: ['#help','#asteroids'],	// Default Channels To Join
    quit_message: 'User left the page',			// General quit message
  },
  // Website Settings
  site: {
    allow: new Array(							// allow these sites to send command messages
      'http://epcit.biz',
      'http://au.epcit.biz'
    ),
  },
  // Administrator Settings
  admin: {
    nick: 'NoIRC',
  }
}

/*

  Delete the following section and remember to rename the edited version of this file
  
*/
console.log('Please remove the last two lines from noirc.config.js');
module.exports['kill'] = true;

