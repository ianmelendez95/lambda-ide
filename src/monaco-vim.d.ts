declare module 'monaco-vim' {
  export function initVimMode(
    editor: monaco.editor.IStandaloneCodeEditor, 
    element: HTMLElement
  ): void
}