/* 
	You can run this by calling gulp from the command line.
	> gulp
	> gulp watch
	> gulp compile
*/
var hub = require('../lib/index.js');
hub(['project1/gulpfile.js', 'proj*/gulpfile.js', 'project1/**/gulpfile.js', '!node_modules/**']);