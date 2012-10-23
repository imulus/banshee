require('should');

var fs = require('fs'),
    path = require('path');

var Asset = require('../lib/asset');

var testAssetsDir = 'test/assets/asset/javascript';

function makeFilenames(/* name1,name2,.. */) {
  var names = Array.prototype.slice.call(arguments);
  return names.map(function(name) {
    return process.cwd() + '/' + testAssetsDir + '/' + name;
  });
}


describe("Asset", function() {
  describe("javascript", function() {
    it("knows its type", function() {
      var asset = new Asset(makeFilenames('script1.js')[0]);
      asset.type.should.eql("js");
    });


    it("finds its dependencies", function() {
      var filenames = makeFilenames( 'script2.js', 'nested/script3.js');
      var asset = new Asset(makeFilenames('script1.js')[0]);
      asset.dependencies().should.eql(filenames);
    });
  });

  describe("coffeescript", function() {
    it("knows its type", function() {
      var asset = new Asset(makeFilenames('script1.coffee')[0]);
      asset.type.should.eql("coffee");
    });

    it("finds its dependencies", function() {
      var filenames = makeFilenames( 'script2.coffee', 'nested/script3.coffee');
      var asset = new Asset(makeFilenames('script1.coffee')[0]);
      asset.dependencies().should.eql(filenames);
    });
  });
});

