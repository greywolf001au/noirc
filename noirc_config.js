/*
	Node.js IRC Configuration File
	Author: Elijah Cowley (GreyWolf)
	Owner: EPCIT
	Website: http://epcit.biz
	IRC Server: irc://irc.epcit.biz:6667
*/
module.exports = {
  // App settings
  app: {
    port: 3000,					// Express Server Port
    debug: false,				// Output Debug Messages
    encoding: 'utf8',				// Character Encoding For STDIN (Console Input)
    language: 'en',				// Locale Language
  },
  io: {
    log_level: 1				// Log Level For Socket.IO
  },
  socket: {
    encoding: 'ascii'				// Net.Socket Encoding (Net.Socket Connects To IRC Server)
  },
  // IRC Settings
  irc: {
    server_type: 'unreal32',			// IRC Server Type (Message Processor)
    server: 'irc.epcit.biz',			// IRC Server Address To Connect To
    port: 6667,					// IRC Server Port To Connect On
    username: 'nodejs_client',			// Username To Pass To IRC Server
    default_channels: ['#help','#asteroids'],	// Default Channels To Join
    quit_message: 'User left the page',
  },
  site: {
    allow: [
      'http://epcit.biz',
      'http://au.epcit.biz'
    ]
  }
}
