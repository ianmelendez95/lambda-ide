import * as _ from 'lodash'
import './style.css'
import * as React from 'react'
import * as ReactDOM from 'react-dom/client'

import App from './App'

const domContainer = document.querySelector('#root');
const root = ReactDOM.createRoot(domContainer);
root.render(React.createElement(App));
