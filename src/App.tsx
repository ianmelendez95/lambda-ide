import * as React from 'react'
import Editor, { EditorRef } from './monaco/Editor'
import './style.css'


export default function App(): React.ReactElement {
  const editorRef: EditorRef = React.useRef(null)

  function onClickButton() {
    if (editorRef.current == null) {
      console.warn("Editor not loaded")
      return
    }

    console.log("Content: ", editorRef.current.getValue())
  }

  return (
    <div style={{ height: "100vh", 
                  width: "100vw",
                  display: "flex",
                  flexFlow: "row nowrap" }}>
      <div style={{ height: "100%", width: "50%" }}>
        <Editor editorRef={editorRef}/>
      </div>
      <div>
        <input id="compile-button" type="button" onClick={onClickButton}/>
      </div>
    </div>
  )
}