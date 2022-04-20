import * as monaco from 'monaco-editor'

export default function registerLambdaLanguage(): void {
  monaco.languages.register({ id: 'lambda' });
  monaco.languages.setMonarchTokensProvider('lambda', createMonarchTokensProvider());

  monaco.languages.setLanguageConfiguration('lambda', {
    brackets: [
      ['(', ')'],
    ],
  
    autoClosingPairs: [
      { open: '(', close: ')' },
      { open: '"', close: '"' }
    ],
  
    surroundingPairs: [
      { open: '(', close: ')' },
      { open: '"', close: '"' }
    ]
  })
}

// monarch editor: https://microsoft.github.io/monaco-editor/monarch.html
// can directly paste the contents in 'return { }' in the above editor
function createMonarchTokensProvider(): monaco.languages.IMonarchLanguage {
  return {
    // Set defaultToken to invalid to see what you do not tokenize yet
    defaultToken: 'invalid',

    keywords: [ 'if' ],

    brackets: [{ open: '(', close: ')', token: 'delimiter.parenthesis' }],

    // // we include these common regular expressions
    symbols: /[=><!~?:&|+\-*\/\^%]+/,

    // The main tokenizer for our languages
    tokenizer: {
      root: [
        // delimiters and operators
        [/[()]/, '@brackets'],

        [/\\/, 'lambda'],
        [/\./, 'lambda.dot'],

        // identifiers and keywords
        [/@symbols/, 'identifier'],
        [/[a-z][a-z0-9\-_]*/, {
          cases: {
            '@keywords': 'keyword',
            '@default': 'identifier'
          }
        }],

        // whitespace
        { include: '@whitespace' },

        // numbers
        [/\d+/, 'number'],

        // strings
        [/"([^"\\])*$/, 'string.invalid'],  // non-teminated string
        [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],

        // characters
        [/'[^\\']'/, 'string'],
        [/'\\''/, ['string', 'string.escape', 'string']],
        [/'/, 'string.invalid']
      ],

      string: [
        [/[^\\"]+/, 'string'],
        [/\\"/, 'string.escape'],
        [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
      ],

      whitespace: [
        [/[ \t\r\n]+/, 'white']
      ],
    },
  };
}
