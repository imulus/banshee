var fs = require('fs'),
    path = require('path');

module.exports = Asset;

function Asset(filepath){
  var self = this;
  this.filepath = filepath;
  this.context = path.dirname(filepath);

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
  return fs.readFileSync(this.filepath, 'utf8');
};


Asset.prototype.dependencies = function() {
  var self = this;
  var regex = self.regex;
  var contents = self.contents();
  var matches = [];

  if (regex.test(contents))
    matches = contents.match(regex).reverse();

  return matches.map(function(match) {
    regex.lastIndex = 0;
    return self.context + '/' + regex.exec(match)[1].trim();
  });
};

