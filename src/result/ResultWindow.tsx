import * as React from 'react'
import * as Lambda from '../lambda/parser'
import { EditorRef } from '../monaco/Editor'

type Props = {
  editorRef: EditorRef
}

const Lang = Lambda.Lang

export default function ResultWindow({ editorRef }: Props) {
  const [expr, setExpr] = React.useState<Lambda.Expr>(null)

  function onClickReduce() {
    if (editorRef.current == null) {
      console.warn("Editor not loaded")
      return
    }

    const content: string = editorRef.current.getValue()
    const parsed: Lambda.Expr = Lang.Expr.tryParse(content)
    setExpr(parsed)
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
          {expr && JSON.stringify(expr)}
        </pre>
      </div>
    </div>
  )
}