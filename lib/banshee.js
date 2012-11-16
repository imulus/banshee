var fs = require('fs'),
    path = require('path'),
    fsz = require('filesize');

var UI = require('./ui'),
    Bundle = require('./bundle'),
    compressor = require('./compressor');

var notify = UI.notify;
var watching = false;
var BansheeError = Error;

module.exports = Banshee;

function Banshee() {}

Banshee.run = function(config) {
  var input = config.input;
  var output = config.output;
  var options = config.options || {};

  if (!input) throw new BansheeError("No input file specified");
  if (!output) throw new BansheeError("No output file specified");

  UI.configure({
    quiet : options.quiet,
    color : options.color
  });

  build(input, output, options);
};

Banshee.error = function(error) {
  if (error instanceof BansheeError) {
    notify(error.message, "failure");
  }
  else {
    notify(error, "failure");
  }

  if (!watching) {
    process.exit(1);
  }
};

function build(sourceFile, outputFile, options) {
  sourceFile = path.resolve(process.cwd(), sourceFile);
  outputFile = path.resolve(process.cwd(), outputFile);

  UI.cursor.hide();

  if (options.clear || options.watch) {
    UI.screen.clear();
  }



  if (process.platform != 'win32') {
    process.on('SIGINT', function(){
      UI.cursor.show();
      console.log('\n');
      process.exit();
    });
  }

  var bundle = new Bundle;
  bundle.add(sourceFile);

  bundle.contents(function(contents) {
    UI.animation.stop();
    var size = filesize(contents);
    notify(bundle.manifest(options.fullPaths));

    if (options.compress) {
      notify("Compressing bundle...", "info", { timestamp: true });
      contents = compressor.compress(contents, bundle.target());
      size += " -> " + filesize(contents);
    }

    save(contents, outputFile);

    var outputPath = options.fullPaths ? outputFile : outputFile.replace(process.cwd() + "/", "");

    notify("Saved bundle to " + outputPath, "success", {
      timestamp: true,
      extras: [(bundle.filenames().length + " files"), size]
    });

    if (!options.watch) {
      return;
    }

    console.log();
    UI.animation.play();

    if (!watching) {
      watching = true;
      bundle.filenames().forEach(function(filename) {
        fs.watchFile(filename, {'interval' : 100}, function(curr, prev) {
          if (prev.mtime < curr.mtime)
            build(sourceFile, outputFile, options)
        });
      });
    }
  });
};

function save(contents, filepath) {
  fs.writeFileSync(filepath, contents, "utf8");
}

function filesize(contents) {
  return fsz(Buffer.byteLength(contents, 'utf8'), 0);
}



