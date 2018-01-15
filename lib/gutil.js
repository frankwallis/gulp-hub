var log = require('gulplog');
var colors = require('ansi-colors');

module.exports = {
  log: function() {
    log.info.apply(log, arguments);
  },
  colors: colors
};
