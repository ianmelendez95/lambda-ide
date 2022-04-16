"use strict"; 

import * as React from 'react'
import * as L from '../lambda/lang'
import Parser from '../lambda/parser'
import { EditorRef } from '../monaco/Editor'

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
  value: L.Expr
}

type ParseState = NoneState | ErrorState | SuccessState

function showParseState(state: ParseState): string {
  if (state.kind === 'state-none') {
    return ""
  } else if (state.kind === 'state-error') {
    return state.message
  } else {
    return L.showExpr(state.value)
  }
}

function successState(value: L.Expr): ParseState {
  return { kind: 'state-success', value }
}

function errorState(message: string): ParseState {
  return { kind: 'state-error', message }
}

export default function ResultWindow({ editorRef }: Props) {
  const [parseState, setParseState] = React.useState<ParseState>({ kind: 'state-none' })

  function onClickReduce() {
    if (editorRef.current == null) {
      console.warn("Editor not loaded")
      return
    }

    try {
      setParseState(successState(Parser.tryParse(editorRef.current.getValue())))
    } catch (e) {
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
      <div style={{ margin: 10 }}>
        <pre className='expr-pre'>
          {showParseState(parseState)}
        </pre>
      </div>
    </div>
  )
}