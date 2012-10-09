var fs = require('fs');

module.exports = Coyote;


function Coyote() {}

Coyote.run = function() {
  var sourceFileContents = fs.readFileSync("test/assets/integration/javascript/script1.js", 'utf8');
  var requiredFileContents = fs.readFileSync("test/assets/integration/javascript/script2.js", 'utf8');
  var outputContents = requiredFileContents + sourceFileContents;

  fs.writeFileSync("test/assets/integration/javascript/output.js", outputContents, "utf8");
}


