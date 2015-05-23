var sass = require('node-sass');
var path = require('path');
var fs = require('fs');
var lococss = require('loco-css');

var paths = ['%s', '_%s', '%s.scss', '_%s.scss', '%s.sass', '_%s.sass'];

function importer(options) {

  function parseFile(p, wholeFile, done) {
    var opts = Object.create(options);
    opts.file = p;
    opts.sourceMapEmbed = true;

    sass.render(opts, function(err, results) {
      if (err) {
        done(new Error(err));
      } else {
        var css = results.css.toString();
        // TODO: use wholeFile option
        lococss(css, p, options.loco, function(err, res) {
          if (err) {
            done(new Error(err));
          } else {
            done({ contents: res.css });
            if (res.map) {
              fs.writeFileSync(res.map.path, res.map.content);
            }
          }
        });
      }
    });
  }

  return function importResolver(url, prev, done) {
    var dir = path.dirname(prev);
    var wholeFile = false;
    if (url.indexOf('loco:') === 0) {
      wholeFile = true;
      url = url.slice(5);
    }
    var file = path.basename(url);
    var folder = path.dirname(url);
    for (var i = 0; i < paths.length; i++) {
      var p = path.normalize(dir + '/' + folder + '/' + paths[i].replace('%s', file));
      if (fs.existsSync(p)) {
        return parseFile(p, wholeFile, done);
      }
    }
    console.log(url, prev);
    done(new Error('File not fount'));
  };
}

function prepareOpts(options) {
  var opts = Object.create(options);
  opts.importer = importer(options);
  return opts;
}

module.exports = {
  render: function(options, cb) {
    sass.render(prepareOpts(options), cb);
  },
  renderSync: function(options) {
    sass.renderSync(prepareOpts(options));
  },
  info: function() {
    return sass.info;
  }
};
