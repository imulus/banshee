var fs = require('fs'),
    path = require('path');

var Asset = require('./asset');

module.exports = Bundle;

function Bundle() {
  this.assets = [];
}

Bundle.prototype.filenames = function() {
  return this.assets.map(function(asset) {
    return asset.filepath;
  });;
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
  return this.filenames().indexOf(filepath) >= 0;
};


Bundle.prototype.contents = function() {
  return this.assets.map(function(asset) {
    return asset.contents();
  }).join("\n");
};


function addFile(filepath) {
  var self = this;
  var ext = path.extname(filepath);
  if (ext != '.js' && ext != '.coffee')
    return;

  var asset = new Asset(filepath);
  self.assets.unshift(asset);

  asset.dependencies().forEach(function(dependency) {
    self.add(dependency);
  });
};


function addDirectory(directory) {
  var self = this;
  var files = fs.readdirSync(directory);
  files.forEach(function(file) {
    var name = directory + '/' + file;
    self.add(name);
  });
};


