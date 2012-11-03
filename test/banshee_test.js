require('./test_helper');

var fs = require('fs'),
    coffee = require('coffee-script');

var Banshee = require('../lib/banshee');


describe("Banshee", function(){
  it("throws when no input file is provided", function() {
    var program = { args: [] };
    (function() {
      Banshee.run(program);
    }).should.throw(/No input file specified/);
  });

  it("throws when no output file is provided", function() {
    var program = { args: ["input"] };
    (function() {
      Banshee.run(program);
    }).should.throw(/No output file specified/);
  });
});
