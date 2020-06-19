import { PuppyViewer } from '../src/playground/viewer';

test('get value and set value', () => {
  const viewer = new PuppyViewer(document.createElement('div'));
  console.log(viewer.element)
});