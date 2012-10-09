require('should');

var fs = require('fs'),
    path = require('path');

var Bundle = require('../lib/bundle');

var testAssetsDir = 'test/assets/bundle/javascript';

function makeFilenames(/* name1,name2,.. */) {
  var names = Array.prototype.slice.call(arguments);
  return names.map(function(name) {
    return process.cwd() + '/' + testAssetsDir + '/' + name;
  });
}


describe("Bundle", function() {
  describe("add", function() {

    it("finds file dependencies", function() {
      return true;
      var input = "test/assets/bundle/javascript/script1.js";
      var bundle = new Bundle;
      bundle.add(input);

      var filenames = makeFilenames('nested/deeply/script4.js',
                                     'nested/script3.js',
                                     'script2.js',
                                     'script1.js');

      bundle.filenames().should.eql(filenames);
    });


    it("finds directory dependencies", function() {
      var bundle = new Bundle;
      bundle.add('test/assets/bundle/javascript/lib');

      var filenames = makeFilenames('lib/things/script4.js',
                                    'lib/stuff/script2.js',
                                    'lib/stuff/nested/script3.js',
                                    'lib/script1.js');

      bundle.filenames().should.eql(filenames);
    });


    it("only adds acceptable filetypes", function(){
      var bundle = new Bundle;
      var files = makeFilenames('script.js', 'script.coffee', 'script.txt', 'script');

      files.forEach(function(file, index) {
        if (fs.existsSync(file))
          fs.unlinkSync(file);

        fs.writeFileSync(file, index, 'utf8');
        bundle.add(file);
      });

      bundle.filenames().should.eql(makeFilenames('script.coffee', 'script.js'));
    });

  });
});




