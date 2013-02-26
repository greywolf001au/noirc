
	Node.js IRC Client
	Version: 0.0.1a
	Author: Elijah Cowley (GreyWolf)
	Owner: EPCIT
	Website: http://epcit.biz
	IRC Server: irc://irc.epcit.biz:6667

  -----------------------------------------------------------------------------------------------

****************** INSTALL *************************

Required Modules:
    net
    express
    http
    url
    colors
    termhelper

  To get required use npm install -g module_name
  where module_name is the name of the required module to install.

** note: You may be required to install modules as the root user using sudo to be able to write to the systems shared libraries directory.

Download the zip file and extract it to your Node.js root directory then type: cd noirc && npm install colors

  -----------------------------------------------------------------------------------------------

****************** CONFIGURE *************************

Edit the file noirc_config.js file using your favourite text editor and save to noirc.config.js

Notes:
  i. termhelper module does not yet support character encoding, this may change in future versions.

  -----------------------------------------------------------------------------------------------

****************** USEAGE ****************************

To start Node.js IRC Client, from the noirc directory type: node noirc.js
To run as a daemon:
  Install forever using the command: npm install -g forever
  Type: forever start noirc.js

For help using Node.js IRC, at the prompt type: help

  -----------------------------------------------------------------------------------------------

****************** FUTURE UPDATES ****************************

  1. General code cleanup
  2. Create interpreters for various ircd's
  3. Add templating for output methods (terminal & site)
  4. Add update and other various features to the console


