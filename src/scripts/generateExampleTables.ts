import { stringify as json5Stringify } from 'json5';

import createDiff, { diffChangesViewConsole, diffJsView, diffSortedView, isPlainObject } from '../main';

const stringify = (input: any): string => json5Stringify(input, null, 2);
const forEach = async <T>(array: T[], callback: (item: T, index: number) => Promise<void>) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index);
  }
}

const examples = [
  [
    { foo: 123, bar: 456 },
    { foo: 123, bar: '457', baz: 789 },
  ],
  [
    [{ id: 10, value: 'foo' }, { id: 1, value: 'bar' }],
    [{ id: 10, value: 'foo' }, { id: 1, value: 'barr' }],
  ],
  [
    [{ id: 10, value: 'foo' }, { id: 1, value: 'bar' }, { id: 2, value: 'baz' }],
    [{ id: 10, value: 'foo' }, { id: 1, value: 'barr' }, { id: 3, value: 'baz'}],
  ],
  [
    [{ id: 'ten', value: { foo: 'foo', bar: 'bar' } }, { id: 'one', value: 'bar' }, { id: 'two', value: 'baz' }],
    [{ id: 'ten', value: { foo: 'foo', bar: 'nieBar' } }, { id: 'one', value: 'barr' }, { id: 'three', value: 'baz'}],
  ],
];

const wrapJsView = (content: string) => `
<table>
<tr><td>Source</td><td>Compare</td><td>Result</td></tr>
${content}
</table>
`;

const wrapCompareView = (content: string) => `
<table>
${content}
</table>
`;

const wrapDiffChangesView = (content: string) => `
<table>
<tr><td>Source</td><td>Compare</td><td>Result</td></tr>
${content}
</table>
`;

const diff = createDiff({
  getArrayElementId: (item: any) => isPlainObject(item) ? item.id : null,
})

const generateExamplesTables = async () => {
  const jsViewExampleLines: string[] = [];
  const sortedViewExampleLines: string[] = [];
  const changesViewExampleLines: string[] = [];

  await forEach(examples, async ([source, target], index) => {
    const diffDetails = diff(source, target);

    // jsView
    const jsView = diffJsView(diffDetails);

    jsViewExampleLines.push('<tr>');
    jsViewExampleLines.push(`<td>`);
    jsViewExampleLines.push('');
    jsViewExampleLines.push('```json5');
    jsViewExampleLines.push(stringify(source));
    jsViewExampleLines.push('```');
    jsViewExampleLines.push('');
    jsViewExampleLines.push('</td>');
    jsViewExampleLines.push(`<td>`);
    jsViewExampleLines.push('');
    jsViewExampleLines.push('```json5');
    jsViewExampleLines.push(stringify(target));
    jsViewExampleLines.push('```');
    jsViewExampleLines.push('');
    jsViewExampleLines.push('</td>');
    jsViewExampleLines.push(`<td>`);
    jsViewExampleLines.push('');
    jsViewExampleLines.push('```json5');
    jsViewExampleLines.push(jsView);
    jsViewExampleLines.push('```');
    jsViewExampleLines.push('');
    jsViewExampleLines.push('</td>');
    jsViewExampleLines.push('</tr>');

    // sortedView
    const sortedView = diffSortedView(diffDetails);

    sortedViewExampleLines.push('<tr>');
    sortedViewExampleLines.push(`<td colspan="2">`);
    sortedViewExampleLines.push('<h3>Data:</h3>');
    sortedViewExampleLines.push('</td>');
    sortedViewExampleLines.push('</tr>');

    sortedViewExampleLines.push('<tr><td>Source</td><td>Compare</td></tr>');
    sortedViewExampleLines.push('<tr>');
    sortedViewExampleLines.push(`<td>`);
    sortedViewExampleLines.push('');
    sortedViewExampleLines.push('```json5');
    sortedViewExampleLines.push(stringify(source));
    sortedViewExampleLines.push('```');
    sortedViewExampleLines.push('');
    sortedViewExampleLines.push('</td>');
    sortedViewExampleLines.push(`<td>`);
    sortedViewExampleLines.push('');
    sortedViewExampleLines.push('```json5');
    sortedViewExampleLines.push(stringify(target));
    sortedViewExampleLines.push('```');
    sortedViewExampleLines.push('');
    sortedViewExampleLines.push('</td>');
    sortedViewExampleLines.push(`</tr>`);

    sortedViewExampleLines.push(`<tr>`);
    sortedViewExampleLines.push(`<td colspan="2">`);
    sortedViewExampleLines.push('<h3>Results:</h3>');
    sortedViewExampleLines.push('</td>');
    sortedViewExampleLines.push(`</tr>`);

    sortedViewExampleLines.push('<tr><td>Source</td><td>Compare</td></tr>');
    sortedViewExampleLines.push(`<tr>`);
    sortedViewExampleLines.push(`<td>`);
    sortedViewExampleLines.push('');
    sortedViewExampleLines.push('```json5');
    sortedViewExampleLines.push(sortedView.source);
    sortedViewExampleLines.push('```');
    sortedViewExampleLines.push('');
    sortedViewExampleLines.push('</td>');
    sortedViewExampleLines.push(`<td>`);
    sortedViewExampleLines.push('');
    sortedViewExampleLines.push('```json5');
    sortedViewExampleLines.push(sortedView.target);
    sortedViewExampleLines.push('```');
    sortedViewExampleLines.push('');
    sortedViewExampleLines.push('</td>');
    sortedViewExampleLines.push('</tr>');
    if (index < examples.length - 1) {
      sortedViewExampleLines.push('<tr>');
      sortedViewExampleLines.push('<td colspan="2">');
      sortedViewExampleLines.push('<hr>');
      sortedViewExampleLines.push('</td>');
      sortedViewExampleLines.push('</tr>');
    }

    // diffChangesViewConsole
    const changesView = diffChangesViewConsole(diffDetails);

    changesViewExampleLines.push('<tr>');
    changesViewExampleLines.push(`<td>`);
    changesViewExampleLines.push('');
    changesViewExampleLines.push('```json5');
    changesViewExampleLines.push(stringify(source));
    changesViewExampleLines.push('```');
    changesViewExampleLines.push('');
    changesViewExampleLines.push('</td>');
    changesViewExampleLines.push(`<td>`);
    changesViewExampleLines.push('');
    changesViewExampleLines.push('```json5');
    changesViewExampleLines.push(stringify(target));
    changesViewExampleLines.push('```');
    changesViewExampleLines.push('');
    changesViewExampleLines.push('</td>');
    changesViewExampleLines.push(`<td>`);
    changesViewExampleLines.push('');

    const fileName = `/assets/changesConsoleViewExample${index}.png`;
    console.log('---------', fileName, '---------');
    console.log('');
    console.log(changesView);
    console.log('');
    console.log('---------');

    changesViewExampleLines.push(`![${fileName}](${fileName})`);

    changesViewExampleLines.push('');
    changesViewExampleLines.push('</td>');
    changesViewExampleLines.push('</tr>');
  });

  console.log('------------------');
  console.log(wrapJsView(jsViewExampleLines.join('\n')));
  console.log('------------------')
  console.log(wrapCompareView(sortedViewExampleLines.join('\n')));
  console.log('------------------')
  console.log(wrapDiffChangesView(changesViewExampleLines.join('\n')));
}

generateExamplesTables();

export {};
