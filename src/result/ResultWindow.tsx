"use strict"; 

import * as React from 'react'
import * as L from '../lambda/lang'
import * as R from '../lambda/reduce'
import Parser from '../lambda/parser'
import { EditorRef } from '../monaco/Editor'
import { take } from '../util/generators';
import { pprintLambda } from '../lambda/pprint';

type Props = {
  editorRef: EditorRef
}

type NoneState = {
  kind: "state-none"
}

type ErrorState = {
  kind: "state-error",
  message: string
}

type SuccessState = {
  kind: "state-success",
  value: L.Expr[]
}

type ParseState = NoneState | ErrorState | SuccessState

function showParseState(state: ParseState): string | JSX.Element[] {
  if (state.kind === 'state-none') {
    return 
  } else if (state.kind === 'state-error') {
    return state.message
  } else {
    return state.value.map((expr, i) => {
      return (
        <div key={i} className="expr-div">
          <pre>{pprintLambda(expr)}</pre>
        </div>
      )
    })
  }
}

function successState(value: L.Expr[]): ParseState {
  return { kind: 'state-success', value }
}

function errorState(message: string): ParseState {
  return { kind: 'state-error', message }
}

export default function ResultWindow({ editorRef }: Props): JSX.Element {
  const [parseState, setParseState] = React.useState<ParseState>({ kind: 'state-none' })

  function onClickReduce() {
    if (editorRef.current == null) {
      console.warn("Editor not loaded")
      return
    }

    try {
      const parsed: L.Expr = Parser.tryParse(editorRef.current.getValue())
      const reduced: L.Expr[] = take(10, R.reduceGen(parsed))
      setParseState(successState(reduced))
    } catch (e) {
      console.error(e)
      setParseState(errorState(e.message))
    }
  }

  return (
    <div style={{ display: 'flex', flexFlow: 'column nowrap', width: '100%', height: '100%' }}>
      <div style={{ borderBottom: "1px solid gray" }}>
        <button id="header-button"
                type="button"
                className="header-button"
                onClick={onClickReduce}>
          Reduce
        </button>
      </div>
      {showParseState(parseState)}
    </div>
  )
}