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

Bundle.prototype.type = function() {
  if (!this.assets.length) return "";
  return this.assets[this.assets.length - 1].type;
};

Bundle.prototype.add = function(filepath) {
  var filepath = path.resolve(process.cwd(), filepath);
  if (!fs.existsSync(filepath)) throw new Error('Could not find ' + filepath);
  if (this.contains(filepath)) return;
  if (!this.allows(filepath)) return;

  if (fs.statSync(filepath).isFile())
    this.addFile(filepath);
  else
    this.addDirectory(filepath);
};


Bundle.prototype.contains = function(filepath) {
  return this.filenames().indexOf(filepath) >= 0;
};


Bundle.prototype.allows = function(filepath) {
  var self = this;
  var type = path.extname(filepath).substr(1);
  var types = ['js','coffee','css','less'];

  if (!self.type() && types.indexOf(type) >= 0)
    return true;
  if (fs.statSync(filepath).isDirectory()) 
    return true;

  var allowed = (function() {
    if (self.type() == "js" || self.type() == "coffee") return ['js','coffee'];
    if (self.type() == "css" || self.type() == "less") return ['css', 'less'];
    return [];
  })();

  return fs.statSync(filepath).isFile() && allowed.indexOf(type) >= 0;
};


Bundle.prototype.contents = function() {
  return this.assets.map(function(asset) {
    return asset.contents();
  }).join("\n");
};


Bundle.prototype.addFile = function(filepath) {
  var self = this;

  var asset = new Asset(filepath);
  self.assets.unshift(asset);

  asset.dependencies().forEach(function(dependency) {
    self.add(dependency);
  });
};


Bundle.prototype.addDirectory = function(directory) {
  var self = this;
  var files = fs.readdirSync(directory);
  files.forEach(function(file) {
    var name = directory + '/' + file;
    self.add(name);
  });
};

