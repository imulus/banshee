var strftime = require('strftime');

module.exports = UI;

function UI() {};

UI.settings = {
  quiet: false,
  color: true
};

UI.configure = function(settings) {
  for (var name in settings) {
    this.settings[name] = settings[name];
  }
};

UI.notify = function(message, type, options){
  if (!type) type = "default";
  if (!options) options = {};

  if (options.timestamp){
    message = timestamp(message);
  }

  if (options.extras){
    message += "  ";
    options.extras.forEach(function(extra){
      message += " [" + extra + "]"
    });
  }

  message = types[type](message);

  if(UI.settings.quiet && type == "default") {
    return;
  }

  console.log(message);
}

var colors = {
  red      : 31,
  green    : 32,
  yellow   : 33,
  blue     : 34,
  magenta  : 35,
  cyan     : 36,
  white    : 37
}

var types = {
  success : function(text){
    return colorize(text, colors.green);
  },

  warning : function(text){
    return colorize(text, colors.yellow);
  },

  failure : function(text){
    return colorize(text, colors.red);
  },

  info : function(text){
    return colorize(text, colors.cyan);
  },

  default : function(text){
    return text;
  }
};

function colorize(text, code){
  if (!UI.settings.color) {
    return text;
  }
  else {
    return '\u001b[' + code + 'm' + text + '\u001b[0m';
  }
}

function timestamp(text){
  return strftime("%I:%M:%S") + "      " + text;
}






