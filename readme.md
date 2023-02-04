# Differrer
> Utility to perform deep diff on any data types with smart order detection in arrays and different views implemented for convenience

Differrer is a JavaScript library that provides a set of tools for performing deep-diff operations on any data type, including nested arrays and objects.
It enables the developer to pass a custom function to detect the order of objects in arrays.


Several views are implemented to create a more human-readable version of the diff results. 

## Getting started
### Install the library
`npm i differrer`

### Basic usage
```ts
import createDiff, { getType } from 'differrer';

const diff = createDiff({
  sortArrayItems: true, // default false
  getArrayElementId: (item: any) => getType(item) === 'object' ? item.id : item,
});

const source = [{ id: 10, value: 'foo' }, { id: 1, value: 'bar' }];
const compare = [{ id: 1, value: 'bar' }, { id: 10, value: 'foo' }];

const diffResult = diff(source, compare);
```

The diffResult will look like this:
```json5
{
  sourcePath: [],
  targetPath: [],
  sourceValue: [
    {
      id: 10,
      value: 'foo',
    },
    {
      id: 1,
      value: 'bar',
    },
  ],
  targetValue: [
    {
      id: 1,
      value: 'barr',
    },
    {
      id: 10,
      value: 'foo',
    },
  ],
  sameValue: false,
  sameValueZero: false,
  retrievedId: null,
  sourceOrder: null,
  targetOrder: null,
  sameOrder: null,
  sourceType: 'array',
  targetType: 'array',
  sameType: true,
  added: false,
  removed: false,
  changed: true,
  children: [
    {
      sourcePath: [
        1,
      ],
      targetPath: [
        0,
      ],
      sourceValue: {
        id: 1,
        value: 'bar',
      },
      targetValue: {
        id: 1,
        value: 'barr',
      },
      sameValue: false,
      sameValueZero: false,
      retrievedId: '1',
      sourceOrder: 1,
      targetOrder: 0,
      sameOrder: false,
      sourceType: 'object',
      targetType: 'object',
      sameType: true,
      added: false,
      removed: false,
      changed: true,
      children: {
        id: {
          sourcePath: [
            1,
            'id',
          ],
          targetPath: [
            0,
            'id',
          ],
          sourceValue: 1,
          targetValue: 1,
          sameValue: true,
          sameValueZero: true,
          retrievedId: null,
          sourceOrder: 0,
          targetOrder: 0,
          sameOrder: true,
          sourceType: 'number',
          targetType: 'number',
          sameType: true,
          added: false,
          removed: false,
          changed: false,
          children: null,
        },
        value: {
          sourcePath: [
            1,
            'value',
          ],
          targetPath: [
            0,
            'value',
          ],
          sourceValue: 'bar',
          targetValue: 'barr',
          sameValue: false,
          sameValueZero: false,
          retrievedId: null,
          sourceOrder: 1,
          targetOrder: 1,
          sameOrder: true,
          sourceType: 'string',
          targetType: 'string',
          sameType: true,
          added: false,
          removed: false,
          changed: true,
          children: null,
        },
      },
    },
    {
      sourcePath: [
        0,
      ],
      targetPath: [
        1,
      ],
      sourceValue: {
        id: 10,
        value: 'foo',
      },
      targetValue: {
        id: 10,
        value: 'foo',
      },
      sameValue: true,
      sameValueZero: false,
      retrievedId: '10',
      sourceOrder: 0,
      targetOrder: 1,
      sameOrder: false,
      sourceType: 'object',
      targetType: 'object',
      sameType: true,
      added: false,
      removed: false,
      changed: false,
      children: {
        id: {
          sourcePath: [
            0,
            'id',
          ],
          targetPath: [
            1,
            'id',
          ],
          sourceValue: 10,
          targetValue: 10,
          sameValue: true,
          sameValueZero: true,
          retrievedId: null,
          sourceOrder: 0,
          targetOrder: 0,
          sameOrder: true,
          sourceType: 'number',
          targetType: 'number',
          sameType: true,
          added: false,
          removed: false,
          changed: false,
          children: null,
        },
        value: {
          sourcePath: [
            0,
            'value',
          ],
          targetPath: [
            1,
            'value',
          ],
          sourceValue: 'foo',
          targetValue: 'foo',
          sameValue: true,
          sameValueZero: true,
          retrievedId: null,
          sourceOrder: 1,
          targetOrder: 1,
          sameOrder: true,
          sourceType: 'string',
          targetType: 'string',
          sameType: true,
          added: false,
          removed: false,
          changed: false,
          children: null,
        },
      },
    },
  ],
}
```


## Config
createDiff function accepts the following arguments
- **sortArrayItems**: *boolean* (default: false) - if true diff will sort arrays (different data types will appear in the following order: numbers (sorted), strings (sorted), true, false, null, undefined, objects, arrays)
- **getArrayElementId**: *function* (optional) - function that allows diff to detect the order of objects in arrays. It accepts an array element and returns the id of the element. If not provided, the order of objects in arrays will not be detected. Keep in mind that it may get any type of item depending on the input data you provided to the diff function.
  - **item**: *any* - the element to get the id from
  - **returns**: *string|number|any* - the id of the element, anything other than string or number will be ignored
- **returns**: *function* - the diff function

## Diff function
The diff function accepts two arguments: source and compare. Both arguments can be of any type (number, string, boolean, null, undefined, object, array).

## Diff result
The diff function returns a tree diff result objects. They contain the following properties:
- **sourcePath**: *string[]* - the path to the source value in the source object
- **targetPath**: *string[]* - the path to the target value in the target object
- **sourceValue**: *any* - the value from the source object
- **targetValue**: *any* - the value from the target object
- **sameValue**: *boolean* - true if the source and target values are the same
- **sameValueZero**: *boolean* - true if the source and target values are the same (using SameValueZero comparison)


- **retrievedId**: *string|number* - the id of the object if it was retrieved from the source object


- **sourceOrder**: *number* - the order of the element in the source (if the value is a field in an object or element of the array)
- **targetOrder**: *number* - the order of the element in the target (if the value is a field in an object or element of the array)
- **sameOrder**: *boolean* - true if the source and target orders are the same


- **sourceType**: *string* - the type of the source value (one of the following: 'undefined', 'null', 'boolean', 'number', 'string', 'object', 'array', 'unknown')
- **targetType**: *string* - the type of the target value (one of the following: 'undefined', 'null', 'boolean', 'number', 'string', 'object', 'array', 'unknown')
- **sameType**: *boolean* - true if the source and target types are the same


- **added**: *boolean* - true if the value was added in the target
- **removed**: *boolean* - true if the value was removed in the target
- **changed**: *boolean* - true if the value was changed in the target


- **children**: *object|array* - the children of the value (if the value is an object or an array)

## Supported data types
The diff function understands the following types: undefined, null, boolean, number, string, array and object (only plain JS objects are considered objects). Anything else will have "unknown" type.

## Views
The diff result is not very readable in it's raw form. You can use one of the provided views functions to turn it into something more pleasant. The views functions accept the diff result object and return a string.

Usage example

```ts
import createDiff, { getType, diffJsView, diffSortedView } from 'differrer';

const diff = createDiff({ getArrayElementId: (item: any) => getType(item) === 'object' ? item.id : item });

const source = [{ id: 10, value: 'foo' }, { id: 1, value: 'bar' }];
const compare = [{ id: 1, value: 'bar' }, { id: 10, value: 'foo' }];

const diffResult = diff(source, compare);

const jsView = diffJsView(diffResults);
const sortedView = diffSortedView(diffResults);
```

### jsView
A view that will generate valid javascript (or JSON5) representation of source with changes marked in comments (change // ~, add // +, remove // -).

Here are a few examples:


<table>
<tr><td>Source</td><td>Compare</td><td>Result</td></tr>
<tr>
<td>

```json5
[
  {
    id: 10,
    value: 'foo',
  },
  {
    id: 1,
    value: 'bar',
  },
]
```

</td>
<td>

```json5
[
  {
    id: 10,
    value: 'foo',
  },
  {
    id: 1,
    value: 'barr',
  },
]
```

</td>
<td>

```json5
[
  {
    id: 1,
    value: 'bar', // ~ 'barr'
  }, // ~
  {
    id: 10,
    value: 'foo',
  },
] // ~
```

</td>
</tr>
<tr>
<td>

```json5
[
  {
    id: 10,
    value: 'foo',
  },
  {
    id: 1,
    value: 'bar',
  },
  {
    id: 2,
    value: 'baz',
  },
]
```

</td>
<td>

```json5
[
  {
    id: 10,
    value: 'foo',
  },
  {
    id: 1,
    value: 'barr',
  },
  {
    id: 3,
    value: 'baz',
  },
]
```

</td>
<td>

```json5
[
  {
    id: 1,
    value: 'bar', // ~ 'barr'
  }, // ~
  {
    id: 2, // -
    value: 'baz', // -
  }, // -
  {
    id: 3, // +
    value: 'baz', // +
  }, // +
  {
    id: 10,
    value: 'foo',
  },
] // ~
```

</td>
</tr>
</table>

You can save the result to a file and have a valid JS code (or valid JSON5):
```js
import fs from 'fs';

// ...

const jsView = diffJsView(diffResults);

writeFileSync('results.js', `const diff = ${jsView};`);
```

### sortedView
View that allows easier comparison in text diff tools that compare strings line by line (like diffchecker.com,  diffmerge or diff view in JetBrains IDEs). It will align source and target objects in arrays according to provided getArrayElementId and leave empty lines for a diff tool to pick up easily.

Here are a few examples:

<table>
<tr>
<td colspan="2">
<h3>Data:</h3>
</td>
</tr>
<tr><td>Source</td><td>Compare</td></tr>
<tr>
<td>

```json5
[
  {
    id: 10,
    value: 'foo',
  },
  {
    id: 1,
    value: 'bar',
  },
]
```

</td>
<td>

```json5
[
  {
    id: 10,
    value: 'foo',
  },
  {
    id: 1,
    value: 'barr',
  },
]
```

</td>
</tr>
<tr>
<td colspan="2">
<h3>Results:</h3>
</td>
</tr>
<tr><td>Source</td><td>Compare</td></tr>
<tr>
<td>

```json5
[
  {
    id: 1,
    value: 'bar',
  },
  {
    id: 10,
    value: 'foo',
  },
]
```

</td>
<td>

```json5
[
  {
    id: 1,
    value: 'barr',
  },
  {
    id: 10,
    value: 'foo',
  },
]
```

</td>
</tr>
<tr>
<td colspan="2">
<hr>
</td>
</tr>
<tr>
<td colspan="2">
<h3>Data:</h3>
</td>
</tr>
<tr><td>Source</td><td>Compare</td></tr>
<tr>
<td>

```json5
[
  {
    id: 10,
    value: 'foo',
  },
  {
    id: 1,
    value: 'bar',
  },
  {
    id: 2,
    value: 'baz',
  },
]
```

</td>
<td>

```json5
[
  {
    id: 10,
    value: 'foo',
  },
  {
    id: 1,
    value: 'barr',
  },
  {
    id: 3,
    value: 'baz',
  },
]
```

</td>
</tr>
<tr>
<td colspan="2">
<h3>Results:</h3>
</td>
</tr>
<tr><td>Source</td><td>Compare</td></tr>
<tr>
<td>

```json5
[
  {
    id: 1,
    value: 'bar',
  },
  {
    id: 2,
    value: 'baz',
  },




  {
    id: 10,
    value: 'foo',
  },
]
```

</td>
<td>

```json5
[
  {
    id: 1,
    value: 'barr',
  },




  {
    id: 3,
    value: 'baz',
  },
  {
    id: 10,
    value: 'foo',
  },
]
```

</td>
</tr>
</table>
