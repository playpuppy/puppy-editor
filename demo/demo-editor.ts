//import { PuppyVM, PuppyCode, PuppyWorld } from './puppyvm/vm';
import { PuppyEditor } from '../dist/playground/editor';

const editor = new PuppyEditor(
  document.getElementById("editor"),
  { puppyCodeAction: { koinuCodeAction: (source) => source } }
);
editor.setModel(`
print('Hello, World')
def __keyup__(key, time):
  print(key)
  print(time)
`, "python");
editor.addLineHighLight(2, 2);

