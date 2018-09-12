'use strict';

const fs = require('fs');
const path = require('path');
let debug = require('debug')('express-bootstrapper');

/**
 * Bootstraps a list of files (provided by a configuration)
 *
 * @param  {object}   app  the express application
 * @param  {Function} cb   callback
 */
module.exports = function(app, cb) {
  const rootDir = process.env.APP_ROOT || path.resolve();
  let config = getJSONConfig();
  let bootDirectory = Object.keys(config)[0];
  config[bootDirectory].forEach((middleware) => {
    debug(`Loading ${bootDirectory}/${middleware}`);
    require(path.resolve(rootDir, bootDirectory, middleware))(app);
  });

  if (cb) {
    cb();
  }
};

function getJSONConfig() {
  let configFileName = 'bootstrap.json';
  try {
    debug(`Bootstrapping ${configFileName}`);
    return require(path.resolve(`./${configFileName}`));
  } catch (e) {
    throw new Error(`No bootstrap configuration found. You have to provide a ${configFileName} in your app root.`);
  }
}
