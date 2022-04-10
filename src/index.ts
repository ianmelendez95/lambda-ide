import * as _ from 'lodash'
import './style.css'
import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import registerLambdaLanguage from './monaco/lambda'

import App from './App'

registerLambdaLanguage()

const domContainer = document.querySelector('#root');
const root = ReactDOM.createRoot(domContainer);
root.render(React.createElement(App));
