import createDiff, { isPlainObject } from '../main';
import { diffChangesViewRaw, diffChangesViewConsole } from '../diffChangesView/diffChangesView';

const source = [{ id: 'ten', value: { foo: 'foo', bar: 'bar' } }, { id: 'one', value: 'bar' }, { id: 'two', value: 'baz' }];
const target = [{ id: 'ten', value: { foo: 'foo', bar: 'nieBar' } }, { id: 'one', value: 'barr' }, { id: 'three', value: 'baz'}];

const diff = createDiff({
  getArrayElementId: (value: any) => isPlainObject(value) ? value.id : null,
})(source, target);

console.log('diffChangesViewConsole:');
console.log(diffChangesViewConsole(diff));
console.log('');
console.log('diffChangesViewRaw:');
console.log(diffChangesViewRaw(diff));

