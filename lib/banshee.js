var fs = require('fs'),
    path = require('path');

var Bundle = require('./bundle');

module.exports = Banshee;

function Banshee() {}

Banshee.run = function(sourceFile, outputFile) {
  sourceFile = path.resolve(process.cwd(), sourceFile);
  outputFile = path.resolve(process.cwd(), outputFile);

  var bundle = new Bundle;
  bundle.add(sourceFile);

  bundle.contents(function(contents) {
    fs.writeFileSync(outputFile, contents, "utf8");
  });
}

