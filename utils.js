var path = require('path');
var Buffer = require('buffer').Buffer;
var crypto = require('crypto');

var hash = {
  sha1: function(str) {
    var shasum = crypto.createHash('sha1');
    shasum.update(str);
    return shasum.digest('hex');
  },
  base64: function(str) {
    return new Buffer(str).toString('base64')
  }
};

var utils = {
  // normalize: function(p) {
  //   // if (!path.isAbsolute(p)) { // Doesn't work on Node 0.10
  //   if (p.indexOf('/')) { // Works only on *NIX based systems
  //     p = process.cwd() + '/' + p;
  //   }
  //   return path.normalize(p);
  // },

  removeExt: function(p) {
    p = p.split('.');
    p.pop();
    return p.join('.');
  },

  formatWrapper: function(format) {
    return function(opts) {
      var hashStr = opts.filepath + '_' + opts.selector;
      return format.split('%').map(function(str, index) {
        if (index % 2) {
          var cmd = str.split(':');
          if (opts[str]) {
            return opts[str];
          } else if (cmd.length === 2 && hash[cmd[0]]) {
            return hash[cmd[0]](hashStr).slice(0, ~~cmd[1]);
          }
        } else {
          return str;
        }
      }).join('');
    };
  },

  normalizePath: function(p) {
    while(!p.indexOf('../')) {
      p = p.slice(3);
    }
    return utils.removeExt(p);
  },

  sanitizePath: function(p) {
    // TODO: This is not enough
    return p.replace(/\/|\./gi, '__');
  },

  formatMap: function(map) {
    var out = 'module.exports = ';

    out += JSON.stringify(map);

    return out + ';';
  }
};

module.exports = utils;
