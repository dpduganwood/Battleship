# express-bootstrapper

---
[![GitHub build](https://travis-ci.org/raoulus/express-bootstrapper.svg?branch=master)]()
[![GitHub tag](https://img.shields.io/github/tag/raoulus/express-bootstrapper.svg)]()
[![GitHub license](https://img.shields.io/github/license/raoulus/express-bootstrapper.svg)]()

This modules lets you easily require a set of files (e.g. middlewares, libraries...) and will help you to keep your `app.js` clean. You only have to maintain a JSON configuration and the bootstrapper takes care that the items are loaded in the specified order. Inspired by [Loopback boot](https://docs.strongloop.com/display/public/LB/Defining+boot+scripts)

## Installation
`npm i express-bootstrapper`

## Usage
`app.js`
```javascript
'use strict';

let express = require('express');
let app = express();
let bootstrap = require('express-bootstrapper');

bootstrap(app, () => {
  app.listen(3000, () => {});
});
```

`bootstrap.json`
```json
{
  "middleware": [
    "session",
    "authentication",
    "whatever"
  ]
}
```
The configuration contains one item with an array of filenames which are loaded (required) in the specified order. In the given example it loads `middleware/session.js`, `middleware/authentication.js` and then `middleware/whatever.js`

_Debugging_:
This module uses the `express-bootstrapper` namespace for debugging. To enable debug mode do the following `DEBUG=express-bootstrapper node app.js`.

## Parameter
- **app**: express application (required)
- **callback**: object (optional)
