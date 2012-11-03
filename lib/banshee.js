var fs = require('fs'),
    path = require('path');

var notify = console.log;

var Bundle = require('./bundle');

module.exports = Banshee;

function Banshee() {}

Banshee.run = function(program) {
  if(!program.args[0]) throw new Error("No input file specified");
  var input_output = program.args[0].split(":");
  var input = input_output[0];
  var output = input_output[1];
  var options = program;

  if (!output) throw new Error("No output file specified");
  this.compile(input, output, options);
};

Banshee.compile = function(sourceFile, outputFile, options) {
  sourceFile = path.resolve(process.cwd(), sourceFile);
  outputFile = path.resolve(process.cwd(), outputFile);
  var quiet = options.quiet || false;

  var bundle = new Bundle;
  bundle.add(sourceFile);

  bundle.contents(function(contents) {
    if (!quiet)
      notify(bundle.manifest());
    fs.writeFileSync(outputFile, contents, "utf8");
    notify("Saved bundle to " + outputFile);
  });
};

Banshee.error = function(err) {
  notify(err.message);
  process.exit(1);
};
