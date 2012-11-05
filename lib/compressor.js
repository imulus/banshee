var uglify = require("uglify-js"),
  cleanCSS = require('clean-css');

module.exports = {
  compress : function(contents, type) {
    if (type == "js")
      return js(contents);

    else if (type == "css")
      return css(contents);

    return contents;
  }
};

function js(contents) {
  var parser = uglify.parser;
  var compressor = uglify.uglify;
  var ast = parser.parse(contents);
  ast = compressor.ast_mangle(ast); // is this too aggro?
  ast = compressor.ast_squeeze(ast);
  contents = compressor.gen_code(ast);
  return contents;
}

function css(contents) {
  return cleanCSS.process(contents);
}

