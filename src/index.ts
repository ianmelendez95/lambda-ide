import * as _ from 'lodash'
import './style.css'
import printMe, { throwException } from './print.js'
import * as monaco from 'monaco-editor'

monaco.editor.create(document.getElementById('container'), {
  value: 'console.log("Hello, world")',
  language: 'javascript'
});