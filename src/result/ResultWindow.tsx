"use strict"; 

import * as React from 'react'
import * as L from '../lambda/parser'
import { EditorRef } from '../monaco/Editor'
import { Result } from 'parsimmon'

type Props = {
  editorRef: EditorRef
}

type ParseResult = L.Expr | string

const Lang = L.Lang

function showParseResult(result: ParseResult): string {
  if (typeof result == 'string') {
    return result
  } else {
    return JSON.stringify(result)
  }
}

export default function ResultWindow({ editorRef }: Props) {
  const [parseResult, setParseResult] = React.useState<ParseResult>(null)

  function onClickReduce() {
    if (editorRef.current == null) {
      console.warn("Editor not loaded")
      return
    }

    const content: string = editorRef.current.getValue()
    try {
      setParseResult(Lang.Expr.tryParse(content))
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
      <div>
        <pre className='expr-pre'>
          {parseResult && showParseResult(parseResult)}
        </pre>
      </div>
    </div>
  )
}