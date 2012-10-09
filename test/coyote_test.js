require('should');
var fs = require('fs');

var Coyote = require('../lib/coyote');


describe("integrated Coyote compiler", function(){

  describe("javascript files", function(){
    var sourceFile, requiredFile, outputFile;

    before(function() {
      sourceFile = "test/assets/integration/javascript/script1.js";
      requiredFile = "test/assets/integration/javascript/script2.js";
      outputFile = "test/assets/integration/javascript/output.js";
    });


    beforeEach(function() {
      if (fs.existsSync(outputFile))
        fs.unlinkSync(outputFile);
    });


    it("combines multiple files", function(){
      Coyote.run(sourceFile, outputFile);

      var sourceFileContents = fs.readFileSync(sourceFile, 'utf8');
      var requiredFileContents = fs.readFileSync(requiredFile, 'utf8');
      var outputContents = fs.readFileSync(outputFile, 'utf8');

      outputContents.should.equal(requiredFileContents + sourceFileContents);
    });

  });

});


