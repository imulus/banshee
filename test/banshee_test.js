require('should');
var fs = require('fs'),
    coffee = require('coffee-script');

var Banshee = require('../lib/banshee');


describe("integrated Banshee compiler", function(){

  describe("javascript files", function(){
    var sourceFile = "test/assets/integration/script1.coffee";
    var requiredFile = "test/assets/integration/script2.js";
    var outputFile = "test/assets/integration/output.js";
    var compiledFile = "test/assets/integration/compiled.js";

    it("combines multiple files", function(){
      Banshee.run(sourceFile, outputFile);
      var sourceFileContents = fs.readFileSync(sourceFile, 'utf8');
      var requiredFileContents = fs.readFileSync(requiredFile, 'utf8');
      var expectedOutput = fs.readFileSync(compiledFile, 'utf8');
      var actualOutput = fs.readFileSync(outputFile, 'utf8');
      actualOutput.should.eql(expectedOutput);
    });
  });


  describe("less files", function(){
    var sourceFile = "test/assets/integration/stylesheet1.less";
    var requiredFile = "test/assets/integration/stylesheet2.less";
    var outputFile = "test/assets/integration/output.css";
    var compiledFile = "test/assets/integration/compiled.css";

    it("combines multiple files", function(){
      Banshee.run(sourceFile, outputFile);
      var sourceFileContents = fs.readFileSync(sourceFile, 'utf8');
      var requiredFileContents = fs.readFileSync(requiredFile, 'utf8');
      var expectedOutput = fs.readFileSync(compiledFile, 'utf8');
      var actualOutput = fs.readFileSync(outputFile, 'utf8');
      actualOutput.should.eql(expectedOutput);
    });
  });

});

