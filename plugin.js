var postcss = require('postcss');
var path = require('path');
var _ = require('lodash');

var utils = require('./utils');

// Partially from here: http://www.w3.org/TR/CSS21/grammar.html#scanner
// Missing in id regex: unicode, escape char
var classRegex = /(\.-?[_a-zA-Z]+[_a-zA-Z0-9-]*)/g;
var idRegex = /(\#[_a-z0-9-\240-\377]+)/g;

module.exports = postcss.plugin('postcss-locoscss', function(opts) {
  // opts: format(), sourceMap{}, map{}, sourceMap{}

  function processIdentifier (selectorAll, selectorName, file) {
    var selectorType = selectorName[0];
    var selector = selectorName.slice(1);
    var formatOpts = {
      filepath: utils.sanitizePath(file),
      filename: utils.sanitizePath(path.basename(file)),
      selector: selector,
      rawFile: file
    };

    var transformedSelector = opts.format(formatOpts);
    console.log(formatOpts, transformedSelector, file);
    opts.map[file] = opts.map[file] || {};
    opts.map[file][selector] = transformedSelector;
    return selectorAll.replace(selectorName, selectorType + transformedSelector);
  }

  function processSelector(selector, file) {
    var list = [].concat(selector.match(classRegex)).concat(selector.match(idRegex));
    _.each(_.compact(list), function(partialSelector) {
      selector = processIdentifier(selector, partialSelector, file);
    });
    return selector;
  }

  function processRuleNode(node, file) {
    node.selector = node.selectors.map(function(selector) {
      return processSelector(selector, file);
    }).join(',');
  }

  return function(root, result) {
    var locals = [];
    root.eachAtRule(function(node) {
      if (node.name === 'local') {
        var localNode = node;
        var pos = opts.sourceMap.originalPositionFor(node.source.start);

        // Separate array so they can be modified
        var forMove = localNode.nodes.slice();
        _.each(forMove, function(node) {
          node.moveBefore(localNode);
          processRuleNode(node, utils.normalizePath(pos.source));
        });
        locals.push(localNode);
      }
    });
    while(locals.length) {
      locals.pop().removeSelf();
    }
  };
});
