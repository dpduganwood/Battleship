'use strict';

const path = require('path');
let expect = require('chai').expect; // jshint ignore:line
let express = require('express');
let app = express();
let server;

describe('bootstrapper', function() {

  afterEach(function() {
    server.close();
    clearRequireCache();
  });

  describe('with config bootstrap.json', function() {

    let modules;

    beforeEach(function(done) {
      startServer(done);
      modules = Object.keys(require.cache);
    });

    it('loads route.js before the bodyparser.js as defined in the config', function() {
      let routes = path.resolve(`middleware/routes.js`);
      let bodyparser = path.resolve(`middleware/bodyparser.js`);
      expect(modules.indexOf(routes)).to.be.below(modules.indexOf(bodyparser));
    });

    it('loads whatever.js after the middlewares', function() {
      let routes = path.resolve(`middleware/routes.js`);
      let bodyparser = path.resolve(`middleware/bodyparser.js`);
      let whatever = path.resolve(`middleware/whatever.js`);
      expect(modules.indexOf(routes)).to.be.below(modules.indexOf(bodyparser));
      expect(modules.indexOf(whatever)).to.be.above(modules.indexOf(routes));
      expect(modules.indexOf(whatever)).to.be.above(modules.indexOf(bodyparser));
    });

  });

});

function startServer(done) {
  let bootstrap = require('../express-bootstrapper');
  bootstrap(app, () => {
    server = app.listen(3001, () => {
      done();
    });
  });
}

function clearRequireCache() {
  Object.keys(require.cache).forEach(function(key) {
    delete require.cache[key];
  });
}
