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

test('font size', () => {
    const editor = new PuppyEditor(document.createElement('div'));
    editor.setFontSize(20);
    const size = editor.getFontSize();
    expect(size).toBe(20);
    editor.addFontSize(3);
    expect(editor.getFontSize()).toBe(size + 3);
});