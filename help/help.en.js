/*
	Node.js IRC English Help Library
	Author: Elijah Cowley (GreyWolf)
	Owner: EPCIT
	Website: http://epcit.biz
	IRC Server: irc://irc.epcit.biz:6667

*/

module.exports = {
  commands: {
    users: { short: 'Show users count', long: 'Show a count of all users online (takes no parameters).' },
    list: { short: 'List online user id\' and nicknames', long: 'Outputs a list of all user id\'s and nicknames (takes no parameters).' },
    kill: { short: 'Terminate a user connection by nickname', long: 'Kill one or more users by nickname (takes space delimited list of nickname or * for all users).' },
    close: { short: 'Terminate a user connection by id', long: 'Kill one or more users by id, if no parameter specified exit Node.js IRC (takes space delimited list of id or * for all users).' },
    debug: { short: 'Toggle debug messages', long: 'Turns on/off debug message output (takes no parameters).' },
    author: { short: 'Display NoIRC author', long: 'Displays the author name of Node.js IRC Client (takes no parameters).' },
    version: { short: 'Display Node.js IRC version',long: 'Displays the current version of Node.js IRC Client (takes no parameters).' },
    help: { short: 'Show help for a topic', long: 'Displays the help screen for a given topic (takes single help item).' },
    exit: { short: 'Exit NoIRC application', long: 'Exits Node.js IRC application (takes no parameters).' },
    quit: { short: 'An alias of exit', long: 'Same as the exit command.' }
  }
}


