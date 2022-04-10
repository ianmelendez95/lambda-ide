import * as React from 'react'
import Editor from './monaco/Editor'
import './style.css'

export default function App(): React.ReactElement {
  return (
    <div style={{ height: "100vh", 
                  width: "100vw",
                  display: "flex",
                  flexFlow: "row nowrap" }}>
      <div style={{ height: "100%", width: "50%" }}>
        <Editor/>
      </div>
      <div></div>
    </div>
  )
}