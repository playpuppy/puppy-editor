import { PuppyEditor } from "../src/playground/editor";

test('get value and set value', () => {
    const editor = new PuppyEditor(document.createElement('div'));
    const testValue = "test";
    editor.setValue(testValue);
    expect(editor.getValue()).toBe(testValue);
    const testValue2 = "test2"
    editor.setValue(testValue2);
    expect(editor.getValue()).toBe(testValue2);
});