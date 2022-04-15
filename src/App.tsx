import * as React from 'react'
import Editor, { EditorRef } from './monaco/Editor'
import ResultWindow from './result/ResultWindow'
import './style.css'

export default function App(): React.ReactElement {
  const editorRef: EditorRef = React.useRef(null)

  return (
    <div style={{ height: "100vh", 
                  width: "100vw",
                  display: "flex",
                  flexFlow: "row nowrap" }}>
      <div style={{ height: "100%", width: "50%" }}>
        <Editor editorRef={editorRef}/>
      </div>
      <div style={{ height: "100%", width: "50%" }}>
        <ResultWindow editorRef={editorRef}/>
      </div>
    </div>
  )
}