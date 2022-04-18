import * as React from "react";
import * as monaco from 'monaco-editor'
import { initVimMode } from 'monaco-vim'
import lambdaSrc from '../exprs/fact.lambda'

const INITIAL_TEXT = lambdaSrc

export type EditorRef = React.MutableRefObject<monaco.editor.IStandaloneCodeEditor>

interface Props {
  /**
   * A ref to the Monaco editor instance.
   * The 'current' property will be set with the editor once it has been initialized.
   */
  editorRef: EditorRef
}

export default function Editor({ editorRef }: Props): React.ReactElement {
  console.debug("Rendering editor")
  
  const editorDivRef: React.MutableRefObject<HTMLDivElement> = React.useRef(null)
  const statusDivRef: React.MutableRefObject<HTMLDivElement> = React.useRef(null)

  React.useEffect(() => {
    if (editorDivRef.current && statusDivRef.current) {
      editorRef.current = setupMonaco(editorDivRef.current, statusDivRef.current)
    } else {
      console.error("Element refs not set")
      console.error("Editor: ", editorDivRef)
      console.error("Status: ", statusDivRef)
    }
  }, [editorDivRef.current, statusDivRef.current])

  return (
    <div style={{ display: "flex",
                  height: "100%",
                  flexFlow: "column nowrap" }}>
      <div id="container" 
           ref={editorDivRef}
           style={{ border: "1px solid #ccc",
                    flexGrow: 1 }}>
      </div>
      <div id="status-bar" 
           ref={statusDivRef}
           style={{ height: 20,
                    border: "1px solid #ccc" }}>
      </div>
    </div>
  )
}

function setupMonaco(editorElement: HTMLDivElement,
                     statusBarElement: HTMLDivElement): monaco.editor.IStandaloneCodeEditor {
  console.debug("Setting up editor")
  const editor: monaco.editor.IStandaloneCodeEditor = monaco.editor.create(editorElement, {
    value: INITIAL_TEXT,
    language: 'lambda',
    theme: 'vs-dark'
  });

  initVimMode(editor, statusBarElement)

  return editor
}
