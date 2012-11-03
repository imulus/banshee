var fs = require('fs'),
    path = require('path'),
    less = require('less');

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

Bundle.prototype.manifest = function(full) {
  return "\n" + this.filenames().map(function(filename) {
    if (full) {
      return "+ " + filename;
    }
    else {
      return "+ " + filename.replace(process.cwd() + "/", "");
    }
  }).join("\n");
};


Bundle.prototype.type = function() {
  if (!this.assets.length) return '';
  return this.assets[this.assets.length - 1].type;
};


Bundle.prototype.target = function() {
  var type = this.type();
  if (type == 'js' || type == 'coffee') return 'js';
  if (type == 'css' || type == 'less') return 'css';
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

  return this;
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
    if (self.target() == "js") return ['js','coffee'];
    if (self.target() == "css") return ['css', 'less'];
    return [];
  })();

  return fs.statSync(filepath).isFile() && allowed.indexOf(type) >= 0;
};




var parseLessFile = function (input, data, fn) {
  var css = "";

  var parser = new(less.Parser)({
    paths: [path.dirname(input)],
    optimization: 2,
    filename: input,
    strictImports: false
  });

  parser.parse(data, function (err, tree) {
    if (err) {
      console.error(err);
      return;
    }
    try {
      css = tree.toCSS({ compress: false, yuicompress: false });
    } catch (e) {
      console.error(e);
    } finally {
      fn(css);
    }
  });
};


Bundle.prototype.contents = function(fn) {
  var self = this;

  if (this.type() == "less") {
    var input = this.assets[this.assets.length - 1].filepath;
    fs.readFile(input, 'utf-8', function(error, data) {
      if (error) throw error;
      parseLessFile(input, data, fn);
    });
  }
  else {
    var contents = this.assets.map(function(asset) {
      return asset.contents();
    }).join("\n");
    fn(contents);
  }
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

