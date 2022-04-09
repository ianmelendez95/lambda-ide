import * as _ from 'lodash'
import './style.css'
import printMe, { throwException } from './print.js'
import * as monaco from 'monaco-editor'
import { initVimMode } from 'monaco-vim'
import * as React from 'react'
import * as ReactDOM from 'react-dom/client'

import App from './App'

// const editor: monaco.editor.IStandaloneCodeEditor = monaco.editor.create(document.getElementById('container'), {
//   value: '(lambda (x) (+ x x))',
//   language: 'scheme'
// });

// initVimMode(editor, document.getElementById('status-bar'))

const domContainer = document.querySelector('#root');
const root = ReactDOM.createRoot(domContainer);
root.render(React.createElement(App));
