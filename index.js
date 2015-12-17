// override promises with bluebird for extended functionality
global.Promise = require('bluebird');
// register babel
require('babel-core/register');
// load app
require('./src');
