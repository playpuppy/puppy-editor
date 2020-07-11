import {
  editor,
  languages,
  Range,
  CancellationToken,
  Position,
  MarkerSeverity,
} from 'monaco-editor';

export type CodeEditor = editor.IStandaloneCodeEditor;
export type ContentChangedEvent = editor.IModelContentChangedEvent;

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
    'editor.inactiveSelectionBackground': '#88000015',
  },
});

editor.setTheme('puppy');

languages.registerCompletionItemProvider('python', {
  provideCompletionItems: (
    model: editor.ITextModel,
    position: Position,
    _context: languages.CompletionContext,
    _token,
  ) => {
    const wordInfo = model.getWordUntilPosition(position);
    const range = new Range(
      position.lineNumber,
      wordInfo.startColumn,
      position.lineNumber,
      wordInfo.endColumn,
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

    math.forEach((label) => {
      suggestions.push({
        label,
        kind: languages.CompletionItemKind.Function,
        insertText: `${label}(\${1})`,
        insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range,
      });
    });

    python.forEach((label) => {
      suggestions.push({
        label,
        kind: languages.CompletionItemKind.Function,
        insertText: `${label}(\${1})`,
        insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range,
      });
    });

    random.forEach((label) => {
      suggestions.push({
        label,
        kind: languages.CompletionItemKind.Function,
        insertText: `${label}(\${1})`,
        insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range,
      });
    });

    matter.forEach((label) => {
      suggestions.push({
        label,
        kind: languages.CompletionItemKind.Constructor,
        insertText: `${label}(\${1})`,
        insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range,
      });
    });

    parameters.forEach((label) => {
      suggestions.push({
        label,
        kind: languages.CompletionItemKind.Property,
        insertText: `${label}=`,
        range,
      });
    });
    return { suggestions };
  },
});

type PuppyEditorOptions = {
  editorCondstructionOptions?: editor.IStandaloneEditorConstructionOptions
  os?: any,
  messagefy?: (log: any) => string,
  callback?: (source: string) => void,
  puppyCodeAction?: PuppyCodeAction
}

type PuppyCodeAction = {
  koinuCodeAction?: KoinuCodeAction
};

type KoinuCodeAction = (source: string) => string;

const zenkaku = '[！　”＃＄％＆’（）＊＋，－．／：；＜＝＞？＠［＼￥］＾＿‘｛｜｝～￣'
  + 'ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ'
  + 'ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ'
  + '１２３４５６７８９０'
  + '｡｢｣､･ｦｧｨｩｪｫｬｭｮｯｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾉﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝﾞﾟ]';

export class PuppyEditor {
  os: any;

  editor: editor.IStandaloneCodeEditor;

  time = 500;

  timer: NodeJS.Timeout | null = null;

  callback: ((source: string) => void) | null = null;

  messagefy: (key: string) => string = (key) => key;

  puppyCodeAction: PuppyCodeAction | undefined;

  fontSize = 20

  public constructor(element: HTMLElement, options: PuppyEditorOptions = {}) {
    const opts = options;
    opts.editorCondstructionOptions = {
      lightbulb: { enabled: true },
      fontSize: this.fontSize,
    } || opts.editorCondstructionOptions;
    this.editor = editor.create(element, opts.editorCondstructionOptions);
    if (opts.os) {
      this.os = opts.os;
    }
    if (opts.messagefy) {
      this.messagefy = opts.messagefy;
    }
    if (opts.callback) {
      this.callback = opts.callback;
    }
    this.puppyCodeAction = opts.puppyCodeAction;
    if (this.puppyCodeAction) {
      this.initCodeAction(this.puppyCodeAction);
    }
    this.editor.onDidChangeModelContent((e) => {
      const { changes } = e;
      changes.forEach((change) => {
        // console.log(change);
        if (change.text.length >= 1) {
          this.checkZenkaku();
        }
        // editor.setModelMarkers(this.editor.getModel()!, 'hoge', [this.marker(change.range)]);
      });
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      if (this.callback) {
        // const { callback } = this;
        // this.timer = setTimeout(() => {
        //   callback(this.editor.getValue());
        // }, this.time);
      }
    });
  }

  public initCodeAction(_codeAction = this.puppyCodeAction) {
    languages.registerCodeActionProvider('python', {
      provideCodeActions: (
        _model: editor.ITextModel,
        _range: Range,
        _context: languages.CodeActionContext,
        _token: CancellationToken,
      ) => {
        const codeActions: languages.CodeAction[] = [];
        // for (const mk of context.markers) {
        //   switch (mk.code) {
        //     case 'NLKeyValues': {
        //       const { source } = mk;
        //       if (source && codeAction && codeAction.koinuCodeAction) {
        //         const suggest = codeAction.koinuCodeAction(source);
        //         const _koinuCodeaction = {
        //           title: `もしかして「${suggest}」ですか？`,
        //           edit: {
        //             edits: [
        //               {
        //                 edits: [
        //                   {
        //                     range,
        //                     text: suggest,
        //                   },
        //                 ],
        //                 resource: model.uri,
        //               },
        //             ],
        //           },
        //           kind: 'quickfix',
        //           isPreferred: true,
        //         };
        //         if (suggest !== '') {
        //           // codeActions.push(koinuCodeaction)
        //         }
        //       }
        //       break;
        //     }
        //     default:
        //       break;
        //   }
        // }
        return { actions: codeActions, dispose: () => { } };
      },
    });
  }

  /**
   * Return the input string of the editor.
   * 
   * @returns The editor string
   */
  public getValue(): string {
    return this.editor.getValue();
  }

  /**
  * Set the input string of the editor.
  * 
  * @param value - The editor string
  */
  public setValue(value: string) {
    this.editor.setValue(value);
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
    const decos: editor.IModelDeltaDecoration[] = zenkakuRanges.map(
      (match: editor.FindMatch) => ({
        range: match.range,
        options: { isWholeLine: false, inlineClassName: 'zenkaku' },
      }),
    );
    // console.log(decos);
    this.decorations = this.editor.deltaDecorations(this.decorations, []);
    this.decorations = this.editor.deltaDecorations(this.decorations, decos);
    // console.log(this.decorations);
  }

  // private marker(range: IRange) {
  //   const markerData: editor.IMarkerData = {
  //     severity: MarkerSeverity.Hint,
  //     startLineNumber: range.startLineNumber,
  //     startColumn: range.startColumn,
  //     endLineNumber: range.endLineNumber,
  //     endColumn: range.endColumn,
  //     code: 'Koinu',
  //     source: 'test',
  //     message: '全角文字です',
  //   };
  //   return markerData;
  // }

  // type LogType = 'error' | 'info' | 'warning' | 'hint';

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
      const data: editor.IMarkerData[] = logs.map((log) => ({
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

  /**
  * Get the font size of the editor.
  * 
  * @return the font size
  */
  public getFontSize(): number {
    return this.fontSize;
  }

  /**
  * Set font size of the editor.
  * 
  * @param size - font size
  */
  public setFontSize(size: number) {
    this.fontSize = size;
  }

  /**
  * Add font size of the editor.
  * 
  * @param num - number of added font size
  */
  public addFontSize(num: number) {
    this.fontSize += num;
  }

  public addLineHighLight(startLineNum: number, endLineNum: number, cssClass = 'highlight') {
    this.decorations = this.editor.deltaDecorations(this.decorations, [
      {
        range: new Range(startLineNum, 1, endLineNum, 1),
        options: { isWholeLine: true, className: cssClass },
      },
    ]);
  }

  public removeLineHighLight(_startLineNum: number, _endLineNum: number) {
    this.editor.deltaDecorations(this.decorations/* FIXME */, []);
  }
}
