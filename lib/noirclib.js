/*
	Node.js IRC Library File
	*** For Future Use ***
	Author: Elijah Cowley (GreyWolf)
	Owner: EPCIT
	Website: http://epcit.biz
	IRC Server: irc://irc.epcit.biz:6667
*/

var config = require('../noirc_config.js')
  , help = require('../help/help.' + config.app.language + '.js')
  , locale = require('../locale/locale.' + config.app.language + '.js')

module.exports = {
  getHelp: function(section) {
    if (section == ' \n' || section == ' *\n') section = '\n'
    if (section == ' ?\n') section = ' help\n';
    return this.helpCommands(section.substr(1).replace('\n',''));
  },
  helpCommands: function(section) {
    var retval = '';
    if (section && section != '') {
      for (var x in help.commands) {
        if (x.toString() == section) retval = help.commands[x].long;
      }
    } else {
      retval = locale.help_string + ":\n"
      for (var x in help.commands) {
        var t = '\t\t';
        if (x.toString().length > 5) t = '\t';
        retval += '  ' + x.toString() + t + help.commands[x].short + '\n';
      }
    }
    return retval;
  },
}
