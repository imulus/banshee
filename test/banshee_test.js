require('./test_helper');

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
});
