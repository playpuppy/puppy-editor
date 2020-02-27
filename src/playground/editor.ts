import {
  editor,
  languages,
  Range,
  CancellationToken,
  Position,
  MarkerSeverity,
  IRange,
} from 'monaco-editor';
//import { PuppyOS } from '../puppyos/os';

// session = monaco.editor.createModel(text, "javascript");
// editor1 = monaco.editor.create(document.getElementById('container1'), {});
// editor2 = monaco.editor.create(document.getElementById('container2'), {});
// editor1.setModel(session);
// editor2.setModel(session);

export type CodeEditor = editor.IStandaloneCodeEditor;
export type ContentChangedEvent = editor.IModelContentChangedEvent;

// import { callKoinu } from './koinu';
// import { ErrorLog, PuppyVM } from '@playpuppy/puppy2d';
// import { messagefy } from '../lang/code';

editor.defineTheme('error', {
  base: 'vs',
  inherit: true,
  rules: [],
  colors: {
    'editor.background': '#ffEEEE',
  },
});

editor.defineTheme('puppy', {
  base: 'vs',
  inherit: true,
  rules: [],
  colors: {
    'editor.foreground': '#000000',
    'editor.background': '#EDF9FA',
    'editorCursor.foreground': '#8B0000',
    'editor.lineHighlightBackground': '#0000FF20',
    'editorLineNumber.foreground': '#008800',
    'editor.selectionBackground': '#88000030',
    'editor.inactiveSelectionBackground': '#88000015'
  }
});

editor.setTheme('puppy');

languages.registerCodeActionProvider('python', {
  provideCodeActions: (
    model: editor.ITextModel,
    range: Range,
    context: languages.CodeActionContext,
    _token: CancellationToken
  ) => {
    const codeActions: languages.CodeAction[] = [];
    for (const mk of context.markers) {
      switch (mk.code) {
        case 'XX': {
          const NLPSymbol = mk.source;
          if (NLPSymbol) {
            const koinuCodeaction = {
              title: `もしかして「」ですか？`,
              edit: {
                edits: [
                  {
                    edits: [
                      {
                        range,
                        text: "テキスト",
                      },
                    ],
                    resource: model.uri,
                  },
                ],
              },
              kind: 'quickfix',
              isPreferred: true,
            }
            codeActions.push(koinuCodeaction)
            codeActions.push(koinuCodeaction)
          }
          break;
        }
        default:
          break;
      }
    }
    return {actions: codeActions, dispose: () => {}};
  },
});

languages.registerCompletionItemProvider('python', {
  provideCompletionItems: (
    model: editor.ITextModel,
    position: Position,
    _context: languages.CompletionContext,
    _token
  ) => {
    const wordInfo = model.getWordUntilPosition(position);
    const range = new Range(
      position.lineNumber,
      wordInfo.startColumn,
      position.lineNumber,
      wordInfo.endColumn
    );
    const math = [
      'pi',
      'sin',
      'cos',
      'tan',
      'sqrt',
      'log',
      'log10',
      'pow',
      'hypot',
      'gcd',
    ];
    const python = ['input', 'print', 'len', 'range', 'int', 'float', 'str'];
    const random = ['random'];
    const matter = ['World', 'Circle', 'Rectangle', 'Polygon', 'Label'];
    const parameters = [
      'width',
      'height',
      'isStatic',
      'restitution',
      'fillStyle',
      'image',
      'strokeStyle',
      'lineWidth',
    ];

    const suggestions: languages.CompletionItem[] = [];

    math.map(label => {
      suggestions.push({
        label,
        kind: languages.CompletionItemKind.Function,
        insertText: `${label}(\${1})`,
        insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range,
      });
    });

    python.map(label => {
      suggestions.push({
        label,
        kind: languages.CompletionItemKind.Function,
        insertText: `${label}(\${1})`,
        insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range,
      });
    });

    random.map(label => {
      suggestions.push({
        label,
        kind: languages.CompletionItemKind.Function,
        insertText: `${label}(\${1})`,
        insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range,
      });
    });

    matter.map(label => {
      suggestions.push({
        label,
        kind: languages.CompletionItemKind.Constructor,
        insertText: `${label}(\${1})`,
        insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range,
      });
    });

    parameters.map(label => {
      suggestions.push({
        label,
        kind: languages.CompletionItemKind.Property,
        insertText: `${label}=`,
        range,
      });
    });
    return { suggestions: suggestions };
  },
});

languages.register({ id: 'puppyConsoleLanguage' });

languages.setMonarchTokensProvider('puppyConsoleLanguage', {
  tokenizer: {
    root: [[/"[^"]*"/, 'string']],
  },
});

const zenkaku =
  '[！　”＃＄％＆’（）＊＋，－．／：；＜＝＞？＠［＼￥］＾＿‘｛｜｝～￣' +
  'ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ' +
  'ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ' +
  '１２３４５６７８９０' +
  '｡｢｣､･ｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾉﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝﾞﾟ]';

const checkZenkaku = (
  codeEditor: CodeEditor,
  decos: string[],
  setDecos: (decos: string[]) => void
) => {
  const zenkakuRanges = codeEditor
    .getModel()!
    .findMatches(zenkaku, true, true, false, null, false);
  const _decos: editor.IModelDeltaDecoration[] = zenkakuRanges.map(
    (match: editor.FindMatch) => ({
      range: match.range,
      options: { inlineClassName: 'zenkakuClass' },
    })
  );
  setDecos(codeEditor.deltaDecorations(decos, _decos));
};

// export const onChange = (
//   codeEditor: CodeEditor | null,
//   setSource: (source: string) => void,
//   decos: string[],
//   setDecos: (decos: string[]) => void,
//   puppy: PuppyVM | null,
//   codeChangeTimer: NodeJS.Timer | null,
//   setCodeChangeTimer: React.Dispatch<React.SetStateAction<NodeJS.Timer | null>>
// ) => (source: string, _event: editor.IModelContentChangedEvent) => {
//   if (codeEditor) {
//     checkZenkaku(codeEditor, decos, setDecos);
//   }
//   setSource(source);
//   if (codeChangeTimer) {
//     clearTimeout(codeChangeTimer);
//   }
//   if (puppy) {
//     setCodeChangeTimer(
//       setTimeout(() => {
//         puppy.load(source, false);
//       }, 500)
//     );
//   }
// };

export const editorDidMount = (setEditor: (editor: CodeEditor) => void) => (
  editor: CodeEditor
) => {
  setEditor(editor);
};

export const fontPlus = (
  fontSize: number,
  setFontSize: (fontSize: number) => void
) => () => {
  setFontSize(fontSize + 3);
};

export const fontMinus = (
  fontSize: number,
  setFontSize: (fontSize: number) => void
) => () => {
  setFontSize(Math.max(12, fontSize - 3));
};

// export const setModelMarkers = editor.setModelMarkers;


// export const setCodeHighLight = (
//   setHighLight: React.Dispatch<React.SetStateAction<string[]>>,
//   codeEditor: CodeEditor
// ) => (startLineNum: number, endLineNum: number) => {
//   setHighLight(hl =>
//     codeEditor.deltaDecorations(hl, [
//       {
//         range: new Range(startLineNum, 1, endLineNum, 1),
//         options: { isWholeLine: true, className: 'code-highlight' },
//       },
//     ])
//   );
// };

// export const resetCodeHighLight = (
//   setHighLight: React.Dispatch<React.SetStateAction<string[]>>,
//   codeEditor: CodeEditor
// ) => () => {
//   setHighLight(hl => codeEditor.deltaDecorations(hl, []));
// };

export class PuppyEditor {
  os: any;
  editor: editor.IStandaloneCodeEditor;
  time: number = 500;
  timer: NodeJS.Timeout | null = null;
  callback: ((source: string) => void) | null = null;

  public constructor(element: HTMLElement, options: any = {}) {
    options = {lightbulb: {enable: true}} || options
    this.editor = editor.create(element, options);
    if (options.os) {
      this.os = options.os;
    }
    this.editor.onDidChangeModelContent((e) => {
      const changes = e.changes;
      for (const change of changes) {
        console.log(change);
        if (change.text.length >= 1) {
          this.checkZenkaku();
        }
        editor.setModelMarkers(this.editor.getModel()!, 'hoge', [this.marker(change.range)]);
      }
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      if (this.callback) {
        const callback = this.callback;
        this.timer = setTimeout(() => {
          callback(this.editor.getValue());
        }, this.time);
      }
    });
  }

  public setModel(source: string, langid: string) {
    const session = editor.createModel(source, langid);
    this.editor.setModel(session);
  }

  public onEdited(callback: (source: string) => void) {
    this.callback = callback;
  }

  decorations: string[] = [];

  private checkZenkaku() {
    const zenkakuRanges = this.editor.getModel()!
      .findMatches(zenkaku, true, true, false, null, false);
    const _decos: editor.IModelDeltaDecoration[] = zenkakuRanges.map(
      (match: editor.FindMatch) => ({
        range: match.range,
        options: { isWholeLine: false, inlineClassName: 'zenkaku' },
      })
    );
    console.log(_decos);
    this.decorations = this.editor.deltaDecorations(this.decorations, []);
    this.decorations = this.editor.deltaDecorations(this.decorations, _decos);
    console.log(this.decorations);
  }

  private marker(range: IRange) {
    const markerData: editor.IMarkerData = {
      severity: MarkerSeverity.Hint,
      startLineNumber: range.startLineNumber,
      startColumn: range.startColumn,
      endLineNumber: range.endLineNumber,
      endColumn: range.endColumn,
      code: 'XX',
      source: 'test',
      message: '全角文字です',
    }
    return markerData;
  }

  //type LogType = 'error' | 'info' | 'warning' | 'hint';

  private static type2severity(type: string) {
    switch (type) {
      case 'error':
        return MarkerSeverity.Error;
      case 'warning':
        return MarkerSeverity.Warning;
      case 'hint':
        return MarkerSeverity.Hint;
      default:
        return MarkerSeverity.Info;
    }
  }

  public addSourceEvent(logs: any[]) {
    const model = this.editor.getModel();
    if (model) {
      const data: editor.IMarkerData[] = logs.map(log => ({
        severity: PuppyEditor.type2severity(log.type),
        startLineNumber: log.row + 1,
        startColumn: log.col!,
        endLineNumber: log.row! + 1,
        endColumn: log.col! + log.len!,
        code: log.key,
        source: log.subject ? log.subject : '',
        message: this.messagefy(log),
      }));
      editor.setModelMarkers(model, 'type', data);
    }
  }

  private messagefy(log: any) {
    return log.key;
  }

  public addLineHighLight(startLineNum: number, endLineNum: number, cssClass = 'highlight') {
    this.decorations = this.editor.deltaDecorations(this.decorations, [
      {
        range: new Range(startLineNum, 1, endLineNum, 1),
        options: { isWholeLine: true, className: cssClass },
      },
    ]);
  }

  public removeLineHighLight(startLineNum: number, endLineNum: number) {
    this.editor.deltaDecorations(this.decorations/*FIXME*/, [])
  }

}
