var nodesass = require('node-sass');
var SourceMapConsumer = require('source-map').SourceMapConsumer;
var postcss = require('postcss');
var fs = require('fs-extra');
var _ = require('lodash');

var postcssPlugin = require('./plugin');
var utils = require('./utils');

module.exports = {
  render: function(options, callbackFn) {
    callbackFn = callbackFn || function() {};
    nodesass.render(_.extend(options, {
      outFile: options.loco.dest.styles,
      sourceMap: true,
      sourceMapEmbed: true,
      sourceMapContents: true
    }), function(err, result) {
      if (err) {
        console.log(err);
        callbackFn(err);
      } else {
        var css = result.css.toString();

        var opts = options.loco;

        opts.format = opts.format || '%filepath%_%selector%_%sha1:5%';
        if (typeof opts.format === 'string') {
          opts.format = utils.formatWrapper(opts.format);
        }

        var selectorMap = {};

        var pluginOptions = {
          format: opts.format,
          map: selectorMap,
          sourceMap: new SourceMapConsumer(result.map.toString())
        };

        var plugins = [postcssPlugin(pluginOptions)].concat(options.plugins);

        postcss(_.compact(plugins))
          .process(css)
          .then(function(res) {
            // console.log(selectorMap);
            fs.outputFileSync(opts.dest.styles, res.css);
            _.each(selectorMap, function(map, file) {
              // console.log(opts.dest.scripts + '/' + file + '.css.js');
              fs.outputFileSync(opts.dest.scripts + '/' + file + '.css.js', utils.formatMap(map));
            });
            callbackFn(null, {
              css: res.css,
              map: Object.keys(selectorMap).length ? { content: selectorMap } : null
            });
          }, function(err) {
            console.log(err);
            callbackFn(err);
          });
      }
    });
  }
};
