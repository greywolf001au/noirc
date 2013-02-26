/*
	Node.js IRC Message Processor For Unreal IRCD 3.2+
	Author: Elijah Cowley (GreyWolf)
	Owner: EPCIT
	Website: http://epcit.biz
	IRC Server: irc://irc.epcit.biz:6667
*/

module.exports = {
  interpret: function(data, con) {
    var retval = {};
    retval.raw = '000';
    retval.channel = 'status';
    retval.message = data;
    retval.users = '';
    if (data.substr(0,6) == "PING :") {
      retval.raw = "PING";
      retval.message = data.substr(6);
    } else if (con) {
      var cdata = data.replace(':' + con.server + ' ','');
      if (cdata.substr(0,3) == '001') {
        // welcome
        retval.raw = cdata.substr(0,3);
        retval.message = cdata.replace(retval.raw + ' ' + con.nickname + ' :','');
      } else if (cdata.substr(0,3) == '002') {
        // host
        retval.raw = cdata.substr(0,3);
        retval.message = cdata.replace(retval.raw + ' ' + con.nickname + ' :','');
        var xdata = cdata.split(' ');
        retval.type = xdata[xdata.length - 1];
      } else if (cdata.substr(0,3) == '003') {
        // server created
        retval.raw = cdata.substr(0,3);
        retval.message = cdata.replace(retval.raw + ' ' + con.nickname + ' :','');
      } else if (cdata.substr(0,3) == '004') {
        // server modes
        retval.raw = cdata.substr(0,3);
        retval.message = cdata.replace(retval.raw + ' ' + con.nickname + ' ' + con.server + ' ' + con.type + ' ','');
      } else if (cdata.substr(0,3) == '005') {
        // server info
        retval.raw = cdata.substr(0,3);
        retval.message = cdata.replace(retval.raw + ' ' + con.nickname + ' ','');
        var parts = retval.message.split(' ');
        for (var x=0; x < parts.length; x++) {
            if (parts[x].substr(0,10) == 'CHANTYPES=') retval.chantypes = parts[x].substr(10);
            if (parts[x].substr(0,7) == 'PREFIX=') retval.prefix = parts[x].substr(7);
        }
      } else if (cdata.substr(0,3) == '251') {
        // user count
        retval.raw = cdata.substr(0,3);
        retval.message = cdata.replace(retval.raw + ' ' + con.nickname + ' :','');
      } else if (cdata.substr(0,3) == '252') {
        // operator count
        retval.raw = cdata.substr(0,3);
        retval.message = cdata.replace(retval.raw + ' ' + con.nickname + ' :','');
      } else if (cdata.substr(0,3) == '254') {
        // channel count
        retval.raw = cdata.substr(0,3);
        retval.message = cdata.replace(retval.raw + ' ' + con.nickname + ' :','');
      } else if (cdata.substr(0,3) == '255') {
        // client count
        retval.raw = cdata.substr(0,3);
        retval.message = cdata.replace(retval.raw + ' ' + con.nickname + ' :','');
      } else if (cdata.substr(0,3) == '265') {
        // local users
        retval.raw = cdata.substr(0,3);
        retval.message = cdata.replace(retval.raw + ' ' + con.nickname + ' :','');
      } else if (cdata.substr(0,3) == '266') {
        // global users
        retval.raw = cdata.substr(0,3);
        retval.message = cdata.replace(retval.raw + ' ' + con.nickname + ' :','');
      } else if (cdata.substr(0,3) == '332') {
        // channel topic
        retval.raw = cdata.substr(0,3);
        retval.channel = cdata.split(' ')[2];
        retval.topic = cdata.replace(retval.raw + ' ' + con.nickname + ' ' + retval.channel + ' :','');
        retval.message = '';
      } else if (cdata.substr(0,3) == '333') {
        // channel topic set by
        retval.raw = cdata.substr(0,3);
        retval.channel = cdata.split(' ')[2];
        retval.topic_setby = cdata.replace(retval.raw + ' ' + con.nickname + ' ' + retval.channel + ' ','');
        retval.message = '';
      } else if (cdata.substr(0,3) == '353') {
        // channel names
        retval.raw = cdata.substr(0,3);
        retval.channel = cdata.split(' ')[3];
        retval.users = cdata.replace(retval.raw + ' ' + con.nickname + ' = ' + retval.channel + ' :','');
        retval.message = '';
      } else if (cdata.substr(0,3) == '366') {
        // channel end of names
        retval.raw = cdata.substr(0,3);
        retval.channel = cdata.split(' ')[2];
        retval.message = ''; //cdata.replace(retval.raw + ' ' + con.nickname + ' ' + retval.channel + ' :','');
      } else if (cdata.substr(0,3) == '372') {
        // MOTD message
        retval.raw = cdata.substr(0,3);
        retval.message = cdata.replace(retval.raw + ' ' + con.nickname + ' :','');
      } else if (cdata.substr(0,3) == '375') {
        // MOTD start
        retval.raw = cdata.substr(0,3);
        retval.message = cdata.replace(retval.raw + ' ' + con.nickname + ' :','');
      } else if (cdata.substr(0,3) == '376') {
        // MOTD end
        retval.raw = cdata.substr(0,3);
        retval.message = cdata.replace(retval.raw + ' ' + con.nickname + ' :','');
      } else {
        var p1 = data.split(':');
        if (p1.length > 1) {
          var p2 = p1[1].split(' ');
          if (p2[1] == 'PRIVMSG') {
            retval.raw = 'PRIVMSG';
            retval.channel = p2[2];
            retval.message = data.replace(':' + p1[1] + ':', '');
            retval.from = p2[0].split('!')[0];
          } else if (p2[1] == 'NOTICE') {
            retval.raw = 'NOTICE';
            retval.channel = p2[2];
            retval.notice = data.replace(':' + p1[1] + ':', '');
            retval.from = p2[0].split('!')[0];
          } else if (p2[1] == 'MODE') {
            retval.raw = 'MODE';
            retval.channel = p2[2];
            retval.mode = p2[3];
            retval.from = '';
            retval.users = data.replace(':' + p2[0] + ' ' + p2[1] + ' ' + p2[2] + ' ' + p2[3] + ' ', '');
            retval.message = p2[0].split('!')[0] + ' sets mode ' + retval.mode + ' ' + retval.users;
          } else if (p2[1] == 'JOIN') {
            retval.raw = 'JOIN';
            retval.channel = data.replace(':' + p1[1] + ':', '');
            retval.from = p2[0].split('!')[0];
            retval.message = retval.from + ' joined ' + retval.channel;            
          } else if (p2[1] == 'PART') {
            retval.raw = 'PART';
            retval.channel =  p2[2];
            retval.from = p2[0].split('!')[0];
            retval.message = retval.from + ' parts ' + retval.channel;            
          } else if (p2[1] == 'QUIT') {
            retval.raw = 'QUIT';
            //retval.channel =  p2[2];
            retval.from = p2[0].split('!')[0];
            retval.message = retval.from + ' quit: ' + p1[3];            
          }
        }
      }
    }
    return retval;
  }
}
