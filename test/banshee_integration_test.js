require('./test_helper');

var fs = require('fs'),
    path = require('path'),
    exec = require('child_process').exec,
    coffee = require('coffee-script');

var Banshee = require('../lib/banshee');

describe("integrated Banshee compiler", function(){

  describe("javascript files", function(){
    var sourceFile = "test/assets/integration/script1.coffee";
    var outputFile = "test/assets/integration/output.js";
    var compiledFile = "test/assets/integration/compiled.js";

    beforeEach(function() {
      if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);
    });

    it("combines multiple files", function(done){
      var command = "bin/banshee " + sourceFile + ":" + outputFile;
      var expectedOutput = fs.readFileSync(compiledFile, 'utf8');

      exec(command, function(error, stdout, stderr) {
        var actualOutput = fs.readFileSync(outputFile, 'utf8');
        actualOutput.should.eql(expectedOutput);
        done();
      });
    });
  });

  describe("less files", function(){
    var sourceFile = "test/assets/integration/stylesheet1.less";
    var outputFile = "test/assets/integration/output.css";
    var compiledFile = "test/assets/integration/compiled.css";

    beforeEach(function() {
      if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);
    });

    it("combines multiple files", function(done){
      var command = "bin/banshee " + sourceFile + ":" + outputFile;
      var expectedOutput = fs.readFileSync(compiledFile, 'utf8');

      exec(command, function(error, stdout, stderr) {
        var actualOutput = fs.readFileSync(outputFile, 'utf8');
        actualOutput.should.eql(expectedOutput);
        done();
      });
    });
  });

});

