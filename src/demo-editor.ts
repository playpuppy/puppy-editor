//import { PuppyVM, PuppyCode, PuppyWorld } from './puppyvm/vm';
import { PuppyEditor } from './playground/editor';

const editor = new PuppyEditor(document.body);
editor.setModel(`
print('Hello, World')
def __keyup__(key, time):
  print(key)
  print(time)
`, "python");
editor.addLineHighLight(2, 2);

