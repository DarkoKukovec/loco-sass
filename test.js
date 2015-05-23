var locosass = require('./index');

var src = 'example/main.scss';
var dest = {
  styles: 'example/dist/styles/main.css',
  scripts: 'example/dist/scripts/'
};

var result = locosass.render({
  file: src,
  outFile: dest.styles,
  sourceMap: true,
  loco: {
    src: src,
    dest: dest.scripts,
    format: '%filepath%_%selector%_%sha1:10%'
  }
}, function(err, result) {
  if (err) {
    console.error(err);
  } else {
    console.log(result.css.toString());
    // console.log(result.map.toString());
    // console.log(result.stats);
    // console.log(result.stats.includedFiles);
  }
});
