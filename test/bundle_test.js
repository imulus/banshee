require('./test_helper');

var fs = require('fs'),
    path = require('path');

var Bundle = require('../lib/bundle');

var testAssetsDir = 'test/assets/bundle';

function makeFilenames(/* name1,name2,.. */) {
  return Array.prototype.slice.call(arguments).map(function(name) {
    return process.cwd() + '/' + testAssetsDir + '/' + name;
  });
}

describe("Bundle", function() {
  describe("JavaScript", function() {
    describe("#add()", function() {
      it("finds file dependencies", function() {
        var filenames = makeFilenames('nested/deeply/script4.js',
                                      'nested/script3.js',
                                      'script2.js',
                                      'script1.js');
        var bundle = new Bundle;
        bundle.add("test/assets/bundle/script1.js");
        bundle.filenames().should.eql(filenames);
      });


      it("finds directory dependencies", function() {
        var filenames = makeFilenames('lib/things/script4.js',
                                      'lib/stuff/script2.js',
                                      'lib/stuff/nested/script3.js',
                                      'lib/script1.js');

        var bundle = new Bundle;
        bundle.add('test/assets/bundle/lib');
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

      it("only adds dependencies once", function(){
        var file = makeFilenames('add_only_once.js')[0];
        var bundle = new Bundle;
        bundle.add(file);
        bundle.add(file);
        bundle.add(file);
        bundle.filenames().should.eql([file]);
      });

      it("throws an error when a dependency doesn't exit", function(){
        var file = makeFilenames('file_does_not_exist.js')[0];
        if (fs.existsSync(file))
          fs.unlinkSync(file);

        var bundle = new Bundle;

        (function(){
          bundle.add(file);
        }).should.throw(/^Could not find/);
      });
    });


    describe("#contents()", function(){
      it("returns the concatenated contents of each file", function(done) {
        var filenames = makeFilenames('nested/deeply/script4.js',
                                      'nested/script3.js',
                                      'script2.js',
                                      'script1.js');

        var expectedContents = filenames.map(function(file) {
          return fs.readFileSync(file, 'utf8');
        }).join("\n");

        var bundle = new Bundle;
        bundle.add("test/assets/bundle/script1.js");
        bundle.contents(function(actualContents) {
          actualContents.should.eql(expectedContents);
          done();
        });
      });
    });
  });


  describe("Less", function() {
    it("finds file dependencies", function() {
      var filenames = makeFilenames('nested/deeply/stylesheet4.less',
                                    'nested/stylesheet3.less',
                                    'stylesheet2.less',
                                    'stylesheet1.less');
      var bundle = new Bundle;
      bundle.add("test/assets/bundle/stylesheet1.less");
      bundle.filenames().should.eql(filenames);
    });

    it("compiles itself", function(done) {
      var expectedContents = fs.readFileSync(makeFilenames('im_compiled.css')[0], 'utf8');
      var bundle = new Bundle;
      bundle.add(makeFilenames('stylesheet1.less')[0]);
      bundle.contents(function(actualContents) {
        actualContents.should.eql(expectedContents);
        done();
      });
    });
  });
});




