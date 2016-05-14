# Tunga Web Client
Web Client App for Tunga.io

# Installation
1. run this command from project root
```
npm install webpack -g
npm install webpack-dev-server -g
npm install
```

# Development (Coding guide)
* All source code goes into /src
* Actions, Components, Stores and Sources go in respective directories
* App Logic goes in app.js
* index.html is a template, refrain from editing (except when adding global libraries served via a CDN)
* Leverage [Redux](http://redux.js.org/) for implementing Data Flow
* Feel free to leverage [ES6/ES2015](https://babeljs.io/docs/learn-es2015/) features in your code
* Use [axios](https://github.com/mzabriskie/axios) for networking

#### Importing modules
Use either ES6 imports
```
import MyAction from 'actions/MyAction';
```

Or CommonJS imports
```
MyAction = require('actions/MyAction');
```

#### Importing Style sheets
Add this to app.js
```
import 'css/style.css';
import 'css/style.less';
```

#### Importing non NPM scripts
Add this to app.js
```
import "script!file.js";
```


# Development
1. run this command from project root
```
npm run watch
```
2. A new browser tab with automatically open at http://127.0.0.1:8080/
(The browser will auto reload when changes are made to the code)

# Deployment
1. run the following commands from project root
```
npm install --production
npm run build
```
2. copy contents of /build folder to webserver
