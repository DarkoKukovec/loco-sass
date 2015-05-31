var locoscss = require('./index');

var src = 'example/main.scss';
var dest = {
  styles: 'example/dist/styles/main.css',
  scripts: 'example/dist/scripts/'
};

locoscss.render({
  file: src,
  loco: {
    dest: dest,
    format: '%filepath%_%selector%_%sha1:10%'
  }
}, function(err, res) {
  console.log(res.css);
});
