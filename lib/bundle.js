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
  var filepath = path.resolve(process.cwd(), filepath);

  if (!fs.existsSync(filepath))
    throw new Error('Could not find ' + filepath);

  if (this.contains(filepath))
    return;

  var isFile = fs.statSync(filepath).isFile();
  (isFile ? addFile : addDirectory).call(this, filepath);
};


Bundle.prototype.contains = function(filepath) {
  return this._filenames.indexOf(filepath) >= 0;
};


Bundle.prototype.contents = function() {
  return this._filenames.map(function(file) {
    return fs.readFileSync(file, 'utf8');
  });
};


function addFile(file) {
  var self = this;
  var regex = /\/\/=\s*requires?\s*(.*)/gim;
  var ext = path.extname(file);
  if (ext != '.js' && ext != '.coffee')
    return;

  var context = path.dirname(file);

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
};


function addDirectory(directory) {
  var self = this;
  var context = directory;
  var files = fs.readdirSync(directory);
  files.forEach(function(file) {
    var name = context + '/' + file;
    self.add(name);
  });
};


