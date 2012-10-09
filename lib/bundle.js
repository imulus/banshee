var fs = require('fs'),
    path = require('path');

module.exports = Bundle;

function Bundle() {
  this._filenames = [];
}

Bundle.prototype.filenames = function() {
  return this._filenames;
};


Bundle.prototype.add = function(filepath) {
  var self = this;
  var filepath = path.resolve(process.cwd(), filepath);
  var context = filepath;
  var regex = /\/\/=\s*requires?\s*(.*)/gim;

  var stats = fs.statSync(filepath);

  if (stats.isFile()) {
    addFile(filepath);
  }

  else if (stats.isDirectory()) {
    addDirectory(filepath);
  }

  function addFile(file) {
    var ext = path.extname(file);
    if (ext != '.js' && ext != '.coffee')
      return;

    context = path.dirname(file);

    self._filenames.unshift(file);

    var contents = fs.readFileSync(file, 'utf8');

    if (!regex.test(contents))
      return false;

    var matches = contents.match(regex).reverse();

    matches.forEach(function(match) {
      regex.lastIndex = 0;
      var name = context + '/' + regex.exec(match)[1].trim();
      self.add(name);
    });
  }

  function addDirectory(directory) {
    var files = fs.readdirSync(directory);
    files.forEach(function(file) {
      var name = context + '/' + file;
      self.add(name);
    });
  }
};

