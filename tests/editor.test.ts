import { PuppyEditor } from "../src/playground/editor";

const editor = new PuppyEditor(new HTMLElement);

test('get value and set value', () => {
    const testValue = "test";
    editor.setValue(testValue);
    expect(editor.getValue).toBe(testValue);
    const testValue2 = "test2"
    expect(editor.getValue).toBe(testValue2);
});