// import 'katex/dist/katex.min.css'   // *** 必須です！
import MarkdownIt from 'markdown-it';
//import mk from 'markdown-it-katex';
const mk = require('markdown-it-katex');

const md = new MarkdownIt("commonmark", {
  //injected: true, // $mdを利用してmarkdownをhtmlにレンダリングする
  breaks: true, // 改行コードを<br>に変換する
  html: true, // HTML タグを有効にする
  linkify: true, // URLに似たテキストをリンクに自動変換する
  //typography: true,  // 言語に依存しないきれいな 置換 + 引用符 を有効にします。
});
md.use(mk);

export class PuppyViewer {
  element: HTMLElement;
  public constructor(element: HTMLElement, options = {}) {
    this.element = element;
  }

  public setHTMLDocument(doc: string) {
    this.element.innerHTML = doc;
  }

  public setMarkdownDocument(doc: string) {
    this.element.innerHTML = md.render(doc);
  }

}