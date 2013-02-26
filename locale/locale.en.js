/*
	Node.js IRC English Language File
	Author: Elijah Cowley (GreyWolf)
	Owner: EPCIT
	Website: http://epcit.biz
	IRC Server: irc://irc.epcit.biz:6667
*/

var colors = require('colors')

module.exports = {
  app_version: 'Node.js IRC'.blue + ' version %version%',
  server_start: 'Express server listening on port: ' + '%port%'.lightBlue,
  prompt: '> ',
  users: 'There are %users% users connected',
  connection_kill: 'Connection killed by admin',
  help_string: 'Available commands',
  labels: {
  	debug: 'Debug Mode',
  	connect: 'Connected',
  	disconnect: 'Disconnected',
  },
  values: {
  	on: 'On',
  	off: 'Off',
  },
  warnings: {
  	
  },
  errors: {
    connect: 'Unable to connect to server',
    
  },
}
