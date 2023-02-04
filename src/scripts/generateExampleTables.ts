import { stringify as json5Stringify } from 'json5';
import createDiff, { diffJsView, diffSortedView, isPlainObject } from '../main';

export const stringify = (input: any): string => json5Stringify(input, null, 2);

const examples = [
  [
    [{ id: 10, value: 'foo' }, { id: 1, value: 'bar' }],
    [{ id: 10, value: 'foo' }, { id: 1, value: 'barr' }],
  ],
  [
    [{ id: 10, value: 'foo' }, { id: 1, value: 'bar' }, { id: 2, value: 'baz' }],
    [{ id: 10, value: 'foo' }, { id: 1, value: 'barr' }, { id: 3, value: 'baz'}],
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

const diff = createDiff({
  getArrayElementId: (item: any) => isPlainObject(item) ? item.id : null,
})

const generateExamplesTables = () => {
  const jsViewExampleLines: string[] = [];
  const sortedViewExampleLines: string[] = [];

  examples.forEach(([source, target], index) => {
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
  });

  console.log('------------------');
  console.log(wrapJsView(jsViewExampleLines.join('\n')));
  console.log('------------------')
  console.log(wrapCompareView(sortedViewExampleLines.join('\n')));
}

generateExamplesTables();

export {};
