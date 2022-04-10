import * as monaco from 'monaco-editor'

export default function registerLambdaLanguage(): void {
  // Register a new language
  monaco.languages.register({ id: 'lambda' });

  // Register a tokens provider for the language
  monaco.languages.setMonarchTokensProvider('lambda', {
    tokenizer: {
      root: [
        [/\[error.*/, 'custom-error'],
        [/\[notice.*/, 'custom-notice'],
        [/\[info.*/, 'custom-info'],
        [/\[[a-zA-Z 0-9:]+\]/, 'custom-date']
      ]
    }
  });

  monaco.editor.defineTheme('lambda-dark', {
    base: 'vs-dark',
    inherit: false,
    rules: [
      { token: 'custom-info', foreground: '808080' },
      { token: 'custom-error', foreground: 'ff0000', fontStyle: 'bold' },
      { token: 'custom-notice', foreground: 'FFA500' },
      { token: 'custom-date', foreground: '008800' }
    ],
    colors: {
      'editor.foreground': '#000000'
    }
  });

  // Register a completion item provider for the new language
  monaco.languages.registerCompletionItemProvider('lambda', {
    provideCompletionItems: (model, position) => {
      // https://github.com/microsoft/monaco-editor/issues/1352
      const word = model.getWordUntilPosition(position);
      const range: monaco.IRange = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn
      };
      var suggestions = [
        {
          label: 'simpleText',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: 'simpleText',
          range: range
        },
        {
          label: 'testing',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'testing(${1:condition})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range: range
        },
        {
          label: 'ifelse',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: ['if (${1:condition}) {', '\t$0', '} else {', '\t', '}'].join('\n'),
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'If-Else Statement',
          range: range
        }
      ];
      return { suggestions: suggestions };
    }
  });
}