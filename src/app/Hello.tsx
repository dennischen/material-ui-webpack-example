/// <reference path="./dt/react/react.d.ts" />
/// <reference path="./dt/react/react-dom.d.ts" />
/// <reference path="./dt/material-ui/material-ui.d.ts" />
import React = require('react');
import ReactDOM = require('react-dom');
import FlatButton from 'material-ui/FlatButton';

import {sayHello} from './Hello2';

export class Hello
    extends React.Component<any, any>{
    render() {
        sayHello();
        return <div>
            <FlatButton 
                label="Hello Typescript + React + Material-UI"
                primary={true}
                />

        </div>
    }
}