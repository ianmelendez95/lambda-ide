import * as _ from 'lodash'
import './style.css'
import printMe, { throwException } from './print.js'

function component() {
  const element = document.createElement('div');
  const btn = document.createElement('button')

  const msg: string[] = ['Hello', 'webpack']

  // Lodash, currently included via a script, is required for this line to work
  element.innerHTML = _.join(msg, ' ');
  element.classList.add('hello')

  btn.innerHTML = 'click me'
  btn.onclick = printMe

  throwException()

  element.appendChild(btn)

  return element;
}

document.body.appendChild(component());