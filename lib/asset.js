var fs = require('fs'),
    path = require('path'),
    coffee = require('coffee-script');

module.exports = Asset;

function Asset(filepath){
  var self = this;
  this.filepath = filepath;
  this.context = path.dirname(filepath);
  this._contents = fs.readFileSync(this.filepath, 'utf8');

  this.type = (function() {
    return path.extname(filepath).substr(1);
  })();

  this.regex = (function() {
    if (self.type == "coffee") {
      return /#=\s*requires?\s(.*)$/gim;
    }
    else {
      return /\/\/=\s*requires?\s*(.*)/gim;
    }
  })();
}

Asset.prototype.contents = function() {
  if (this.type == "coffee") {
    return coffee.compile(this._contents);
  }
  return this._contents;
};


Asset.prototype.dependencies = function() {
  var self = this;
  var regex = self.regex;
  var contents = self._contents;
  var matches = [];

  if (regex.test(contents))
    matches = contents.match(regex).reverse();

  return matches.map(function(match) {
    regex.lastIndex = 0;
    return self.context + '/' + regex.exec(match)[1].trim();
  });
};

