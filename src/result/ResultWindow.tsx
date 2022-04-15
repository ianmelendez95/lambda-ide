"use strict"; 

import * as React from 'react'
import * as L from '../lambda/parser'
import { EditorRef } from '../monaco/Editor'
import { Result } from 'parsimmon'

type Props = {
  editorRef: EditorRef
}

type ParseState = L.Expr | string | null

const Lang = L.Lang

function showParseState(state: ParseState): string {
  if (state === null) {
    return ""
  } if (typeof state === 'string') {
    return state
  } else {
    return JSON.stringify(state)
  }
}

export default function ResultWindow({ editorRef }: Props) {
  const [parseResult, setParseResult] = React.useState<ParseState>(null)

  function onClickReduce() {
    if (editorRef.current == null) {
      console.warn("Editor not loaded")
      return
    }

    try {
      setParseResult(Lang.Expr.tryParse(editorRef.current.getValue()))
    } catch (e) {
      setParseResult(e.message)
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
          {showParseState(parseResult)}
        </pre>
      </div>
    </div>
  )
}