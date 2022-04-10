import * as React from "react";
import * as monaco from 'monaco-editor'
import { initVimMode } from 'monaco-vim'

export default function Editor(): React.ReactElement {
  const editorRef: React.MutableRefObject<HTMLDivElement> = React.useRef(null)
  const statusBarRef: React.MutableRefObject<HTMLDivElement> = React.useRef(null)

  React.useEffect(() => {
    if (editorRef.current && statusBarRef.current) {
      setupMonaco(editorRef.current, statusBarRef.current)
    } else {
      console.error("Element refs not set")
      console.error("Editor: ", editorRef)
      console.error("Status: ", statusBarRef)
    }
  })

  return (
    <div style={{ display: "flex",
                  height: "100%",
                  flexFlow: "column nowrap" }}>
      <div id="container" 
           ref={editorRef}
           style={{ border: "1px solid #ccc",
                    flexGrow: 1 }}>
      </div>
      <div id="status-bar" 
           ref={statusBarRef}
           style={{ height: 20,
                    border: "1px solid #ccc" }}>
      </div>
    </div>
  )
}

function setupMonaco(editorElement: HTMLDivElement,
                     statusBarElement: HTMLDivElement) {
  const editor: monaco.editor.IStandaloneCodeEditor = monaco.editor.create(editorElement, {
    value: '[Sun Mar 7 16:02:00 2004] [notice] Apache/1.3.29 (Unix) configured -- resuming normal operations',
    language: 'lambda',
    theme: 'lambda-dark'
  });

  initVimMode(editor, statusBarElement)
}