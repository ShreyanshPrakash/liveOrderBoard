"use strict";


if (process.env.NODE_ENV === "production") {
  module.exports = require('./src/init.app.js');
} else {
  module.exports = require('./src/liveBoard.js');
}

// need to use bundler to minify and compress the code and create a production bundle, later.