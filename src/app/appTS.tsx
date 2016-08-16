/// <reference path="./dt/react/react.d.ts" />
/// <reference path="./dt/react/react-dom.d.ts" />
/// <reference path="./dt/material-ui/material-ui.d.ts" />

import React = require('react');
import ReactDOM = require('react-dom');
import injectTapEventPlugin = require('react-tap-event-plugin');
import Main2TS from './MainTS'; // Our custom react component

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

// Render the main app react component into the app div.
// For more details see: https://facebook.github.io/react/docs/top-level-api.html#react.render
ReactDOM.render(<Main2TS />, document.getElementById('app'));
