import * as React from 'react'
import Lambda from './lambda/parser'
import Editor, { EditorRef } from './monaco/Editor'
import './style.css'

export default function App(): React.ReactElement {
  const editorRef: EditorRef = React.useRef(null)

  function onClickReduce() {
    if (editorRef.current == null) {
      console.warn("Editor not loaded")
      return
    }

    const content: string = editorRef.current.getValue()
    console.log("Parsed: ", Lambda.App.tryParse(content))
  }

  return (
    <div style={{ height: "100vh", 
                  width: "100vw",
                  display: "flex",
                  flexFlow: "row nowrap" }}>
      <div style={{ height: "100%", width: "50%" }}>
        <Editor editorRef={editorRef}/>
      </div>
      <div style={{ height: "100%", width: "50%" }}>
        <div style={{ width: "100%", borderBottom: "1px solid gray" }}>
          <button id="header-button" 
                  type="button" 
                  className="header-button"
                  onClick={onClickReduce}>
            Reduce
          </button>
        </div>
      </div>
    </div>
  )
}