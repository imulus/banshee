require('./test_helper');
var process = require('child_process');

var fs = require('fs'),
    coffee = require('coffee-script');

var Banshee = require('../lib/banshee');


describe("Banshee", function(){
  it("throws when the input is missing", function() {
    var config = {
      input: undefined,
      output: "defined",
      options: {}
    };

    (function() {
      Banshee.run(config);
    }).should.throw(/No input file specified/);
  });

  it("throws when the output is missing", function() {
    var config = {
      input: "defined",
      output: undefined,
      options: {}
    };

    (function() {
      Banshee.run(config);
    }).should.throw(/No output file specified/);
  });

  it("has consistent version numbers", function(done) {
    var package_version = JSON.parse(fs.readFileSync('./package.json','utf8')).version;

    process.exec('./bin/banshee --version', function (error, stdout, stderr) {
      var executable_version = stdout.replace("\n", "");
      package_version.should.eql(executable_version);
      done();
    });
  });
});
