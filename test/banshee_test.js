require('should');
var fs = require('fs'),
    coffee = require('coffee-script');

var Banshee = require('../lib/banshee');


describe("integrated Banshee compiler", function(){

  describe("javascript files", function(){
    var sourceFile, requiredFile, outputFile;

    before(function() {
      sourceFile = "test/assets/integration/javascript/script1.coffee";
      requiredFile = "test/assets/integration/javascript/script2.js";
      outputFile = "test/assets/integration/javascript/output.js";
    });

    beforeEach(function() {
      if (fs.existsSync(outputFile))
        fs.unlinkSync(outputFile);
    });

    it("combines multiple files", function(){
      Banshee.run(sourceFile, outputFile);

      var sourceFileContents = fs.readFileSync(sourceFile, 'utf8');
      var requiredFileContents = fs.readFileSync(requiredFile, 'utf8');
      var outputContents = fs.readFileSync(outputFile, 'utf8');
      outputContents.should.equal(requiredFileContents + "\n" + sourceFileContents);
    });

  });

});

