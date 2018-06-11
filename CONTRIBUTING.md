# Contributing
These are the general guidelines to follow when contributing to Tunga web client development.

Contributions that don't follow recommendations in this guide may not be reviewed or accepted.

* Follow the [readme](https://github.com/tunga-io/tunga-web/blob/master/readme.md) for instructions on setting up your development environment.
* Follow industry best practices for [ES6](http://es6-features.org/), [React.js](https://reactjs.org/) and [Redux](https://redux.js.org/) for issues not addressed in this document.

## Sending a Pull Request

In general, the contribution workflow looks like this:

* Choose an open issue from the [Issue tracker](https://github.com/tunga-io/tunga-web/issues).
* Fork the repo.
* Create a new feature branch based off the `develop` branch.
* Make sure all tests pass and there are no linting errors.
* Submit a pull request, referencing any issues it addresses.

Please try to keep your pull request focused in scope and avoid including unrelated commits.

After you have submitted your pull request, we'll try to get back to you as soon as possible. We may suggest some changes or improvements.

## Coding Guide
Tunga web client is built on a core of [ES6](http://es6-features.org/), [React.js](https://reactjs.org/), [Redux](https://redux.js.org/) and [React Router](https://github.com/ReactTraining/react-router) and uses [Webpack](https://webpack.js.org/) as the module bundler.

Follow the following coding guidelines when contributing:

* For security, keep sensitive data (e.g passwords, API keys and OAuth secrets) out of the repo.
* All source code goes into `/src`
* Follow the style guide defined in [.editorconfig](https://github.com/tunga-io/tunga-web/blob/master/.editorconfig)
* Leverage [ES6/ES2015](https://babeljs.io/docs/learn-es2015/) features in your code
* index.ejs is a template, refrain from editing (except when adding global libraries served via a CDN)
* Actions, Reducers, Components, Containers and Routes (top level React Router components) go into respective - and appropriately named - directories.
* Use [Redux](https://redux.js.org/) to manage app state and data flow as much as possible.
* Keep most app logic out of app.js and in respective reducers and components.
* Use containers only to connect to Redux store and pass on the state as props to children.
* Use \_\_DEV\_\_ and \_\_PRODUCTION\_\__ predefined globals to filter code the should only be added in development and testing
* Use WebPack's [DefinePlugin](https://webpack.js.org/plugins/define-plugin/) to define global constants e.g public keys
* Import modules using either ES6 imports
```
import MyAction from 'actions/MyAction';
```

Or CommonJS imports
```
MyAction = require('actions/MyAction');
```

* Import style sheets by adding code similar to this to app.js
```
import 'css/style.css';
import 'css/style.less';
```

* Importing non NPM scripts by adding code similar to this to app.js
```
import "script!file.js";
```

* Leverage [Less](http://lesscss.org/) for leaner CSS styling and avoid inline styles in JSX
* Use [axios](https://github.com/mzabriskie/axios) for networking

## Icons
We use a custom icon font to implement. 

Find available icons here: http://resources.tunga.io/tunga-assets/icons/latest/demo.html

Refer to the `Icons` section of our [Style & Component guide](http://sandbox.tunga.io/guide.html) to see how to use icons and size.

In case an icon in the design is missing from the icon font library, do one of the following: 
* contact @davidsemakula or @bartleijssenaar 
* create an issue here: https://github.com/tunga-io/tunga-assets/issues
* send a pull request to: https://github.com/tunga-io/tunga-assets/

## Style & Component Guide

Find the Style & Component guide here: http://sandbox.tunga.io/guide.html


## Screen Designs
The designs will be delivered to you via [Zeplin](https://zeplin.io/) or [Invision](https://www.invisionapp.com/). Please make sure you are familiar with and have access to both tools.

You can ask @bartleijssenaar to give you access.

## Data Dictionary and API docs
You can find information about entities, their corresponding attributes and related endpoints from our Data dictionary documentation here: http://resources.tunga.io/docs/data-dictionary

## Available public resources
You can find links to all our available public resource here: http://resources.tunga.io/


Thank you for contributing!
