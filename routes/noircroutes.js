/*
	Node.js IRC Page Routes
	Author: Elijah Cowley (GreyWolf)
	Owner: EPCIT
	Website: http://epcit.biz
	IRC Server: irc://irc.epcit.biz:6667
*/

//var noirclib = require('../lib/noirclib');
var nickname = '';

module.exports = {
  getIndex: function(req, res) {
    //throw new Error('dummy error');
    if (query.nickname) {
      res.render('chat');
    } else {
      res.render('index');
    }
  },
  chat: function(req, res) {
    res.render('chat');
  }
}
