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
  type = type || "default";
  options = options || {};

  if (options.timestamp) {
    message = timestamp(message);
  }

  if (options.extras) {
    message += "  ";
    options.extras.forEach(function(extra) {
      message += " [" + extra + "]"
    });
  }

  message = types[type](message);

  if (UI.settings.quiet && type == "default") {
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
  success : function(text) {
    return colorize(text, colors.green);
  },

  warning : function(text) {
    return colorize(text, colors.yellow);
  },

  failure : function(text) {
    return colorize(text, colors.red);
  },

  info : function(text) {
    return colorize(text, colors.cyan);
  },

  default : function(text) {
    return text;
  }
};

function colorize(text, code) {
  if (!UI.settings.color) {
    return text;
  }
  else {
    return '\u001b[' + code + 'm' + text + '\u001b[0m';
  }
}

function timestamp(text) {
  return strftime("%I:%M:%S") + "      " + text;
}



// cursor & animation stuff taken from https://github.com/visionmedia/mocha/blob/master/bin/_mocha

var animation = {};

UI.animation = {
  play: function() {
    var frames = [
        '  \u001b[33m◜ \u001b[33mwatching\u001b[0m'
      , '  \u001b[33m◠ \u001b[33mwatching\u001b[0m'
      , '  \u001b[33m◝ \u001b[33mwatching\u001b[0m'
      , '  \u001b[33m◞ \u001b[33mwatching\u001b[0m'
      , '  \u001b[33m◡ \u001b[33mwatching\u001b[0m'
      , '  \u001b[33m◟ \u001b[33mwatching\u001b[0m'
    ];

    var len = frames.length
      , interval = 100
      , i = 0;

    animation.timer = setInterval(function(){
      var frame = frames[i++ % len];
      process.stdout.write('\r' + frame);
    }, interval);
  },

  stop: function() {
    process.stdout.write('\u001b[2K');
    clearInterval(animation.timer);
  }
};


UI.cursor = {
  show: function() {
    process.stdout.write('\u001b[?25h');
  },

  hide: function() {
    process.stdout.write('\u001b[?25l');
  }
};


UI.screen = {
  clear: function() {
    process.stdout.write('\u001B[2J\u001B[0;0f');
  }
};


