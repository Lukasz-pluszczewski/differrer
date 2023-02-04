import {
  diff,
  getType,
  diffJsView as generateJsView,
  diffSortedView as generateSortedView,
  GetArrayElementId,
} from './main';

type Tests = [name: string, source: any, target: any, expect: any][];

const getArrayElementId: GetArrayElementId = (value: any) => value && typeof value === 'object' ? value.order : null;
const simple: Tests = [
  ['compares simple same strings',
    'test', 'test',
    {
      sourcePath: [],
      targetPath: [],
      sourceValue: 'test',
      targetValue: 'test',
      sameValue: true,
      sameValueZero: true,

      retrievedId: null,

      sourceOrder: null,
      targetOrder: null,
      sameOrder: null,

      sourceType: 'string',
      targetType: 'string',
      sameType: true,

      added: false,
      removed: false,
      changed: false,

      children: null,
    }
  ],
  ['compares simple different strings',
    'test', 'test2',
    {
      sourcePath: [],
      targetPath: [],
      sourceValue: 'test',
      targetValue: 'test2',
      sameValue: false,
      sameValueZero: false,

      retrievedId: null,

      sourceOrder: null,
      targetOrder: null,
      sameOrder: null,

      sourceType: 'string',
      targetType: 'string',
      sameType: true,

      added: false,
      removed: false,
      changed: true,

      children: null,
    }
  ],
  ['compares simple same numbers',
    10, 10,
    {
      sourcePath: [],
      targetPath: [],
      sourceValue: 10,
      targetValue: 10,
      sameValue: true,
      sameValueZero: true,

      retrievedId: null,

      sourceOrder: null,
      targetOrder: null,
      sameOrder: null,

      sourceType: 'number',
      targetType: 'number',
      sameType: true,

      added: false,
      removed: false,
      changed: false,

      children: null,
    }
  ],
  ['compares simple different numbers',
    1, 2,
    {
      sourcePath: [],
      targetPath: [],
      sourceValue: 1,
      targetValue: 2,
      sameValue: false,
      sameValueZero: false,

      retrievedId: null,

      sourceOrder: null,
      targetOrder: null,
      sameOrder: null,

      sourceType: 'number',
      targetType: 'number',
      sameType: true,

      added: false,
      removed: false,
      changed: true,

      children: null,
    }
  ],
  ['compares simple same booleans',
    true, true,
    {
      sourcePath: [],
      targetPath: [],
      sourceValue: true,
      targetValue: true,
      sameValue: true,
      sameValueZero: true,

      retrievedId: null,

      sourceOrder: null,
      targetOrder: null,
      sameOrder: null,

      sourceType: 'boolean',
      targetType: 'boolean',
      sameType: true,

      added: false,
      removed: false,
      changed: false,

      children: null,
    }
  ],
  ['compares simple different booleans',
    true, false,
    {
      sourcePath: [],
      targetPath: [],
      sourceValue: true,
      targetValue: false,
      sameValue: false,
      sameValueZero: false,

      retrievedId: null,

      sourceOrder: null,
      targetOrder: null,
      sameOrder: null,

      sourceType: 'boolean',
      targetType: 'boolean',
      sameType: true,

      added: false,
      removed: false,
      changed: true,

      children: null,
    }
  ],
  ['compares nulls',
    null, null,
    {
      sourcePath: [],
      targetPath: [],
      sourceValue: null,
      targetValue: null,
      sameValue: true,
      sameValueZero: true,

      retrievedId: null,

      sourceOrder: null,
      targetOrder: null,
      sameOrder: null,

      sourceType: 'null',
      targetType: 'null',
      sameType: true,

      added: false,
      removed: false,
      changed: false,

      children: null,
    }
  ],
  ['compares null to undefined',
    null, undefined,
    {
      sourcePath: [],
      targetPath: [],
      sourceValue: null,
      targetValue: undefined,
      sameValue: false,
      sameValueZero: false,

      retrievedId: null,

      sourceOrder: null,
      targetOrder: null,
      sameOrder: null,

      sourceType: 'null',
      targetType: 'undefined',
      sameType: false,

      added: false,
      removed: false,
      changed: true,

      children: null,
    }
  ],
];

const simpleObjects: Tests = [
  ['compares differences in objects',
    { bar: 'test', foo: 'test', bam: 'deleted' }, { foo: 'test2', bar: 'test', baz: 'added' },
    {
      sourcePath: [],
      targetPath: [],
      sourceValue: { bar: 'test', foo: 'test', bam: 'deleted' },
      targetValue: { foo: 'test2', bar: 'test', baz: 'added' },
      sameValue: false,
      sameValueZero: false,

      retrievedId: null,

      sourceOrder: null,
      targetOrder: null,
      sameOrder: null,

      sourceType: 'object',
      targetType: 'object',
      sameType: true,

      added: false,
      removed: false,
      changed: true,

      children: {
        bar:  {
          sourcePath: ['bar'],
          targetPath: ['bar'],
          sourceValue: 'test',
          targetValue: 'test',
          sameValue: true,
          sameValueZero: true,

          retrievedId: null,

          sourceOrder: 0,
          targetOrder: 1,
          sameOrder: false,

          sourceType: 'string',
          targetType: 'string',
          sameType: true,

          added: false,
          removed: false,
          changed: false,

          children: null,
        },
        foo:  {
          sourcePath: ['foo'],
          targetPath: ['foo'],
          sourceValue: 'test',
          targetValue: 'test2',
          sameValue: false,
          sameValueZero: false,

          retrievedId: null,

          sourceOrder: 1,
          targetOrder: 0,
          sameOrder: false,

          sourceType: 'string',
          targetType: 'string',
          sameType: true,

          added: false,
          removed: false,
          changed: true,

          children: null,
        },
        bam:  {
          sourcePath: ['bam'],
          targetPath: ['bam'],
          sourceValue: 'deleted',
          targetValue: undefined,
          sameValue: false,
          sameValueZero: false,

          retrievedId: null,

          sourceOrder: 2,
          targetOrder: null,
          sameOrder: false,

          sourceType: 'string',
          targetType: 'undefined',
          sameType: false,

          added: false,
          removed: true,
          changed: true,

          children: null,
        },
        baz:  {
          sourcePath: ['baz'],
          targetPath: ['baz'],
          sourceValue: undefined,
          targetValue: 'added',
          sameValue: false,
          sameValueZero: false,

          retrievedId: null,

          sourceOrder: null,
          targetOrder: 2,
          sameOrder: false,

          sourceType: 'undefined',
          targetType: 'string',
          sameType: false,

          added: true,
          removed: false,
          changed: true,

          children: null,
        },
      },
    }
  ],
];

const simpleArray: Tests = [
  ['compares differences in simple arrays',
    ['abc', 'ghi', 'def'], ['ghii', 'def', 'abc', 'zzz'],
    {
      sourcePath: [],
      targetPath: [],
      sourceValue: ['abc', 'ghi', 'def'],
      targetValue: ['ghii', 'def', 'abc', 'zzz'],
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
          sourcePath: [0],
          targetPath: [2],
          sourceValue: 'abc',
          targetValue: 'abc',
          sameValue: true,
          sameValueZero: true,

          retrievedId: null,

          sourceOrder: 0,
          targetOrder: 2,
          sameOrder: false,

          sourceType: 'string',
          targetType: 'string',
          sameType: true,

          added: false,
          removed: false,
          changed: false,

          children: null,
        },
        {
          sourcePath: [2],
          targetPath: [1],
          sourceValue: 'def',
          targetValue: 'def',
          sameValue: true,
          sameValueZero: true,

          retrievedId: null,

          sourceOrder: 2,
          targetOrder: 1,
          sameOrder: false,

          sourceType: 'string',
          targetType: 'string',
          sameType: true,

          added: false,
          removed: false,
          changed: false,

          children: null,
        },
        {
          sourcePath: [1],
          targetPath: [0],
          sourceValue: 'ghi',
          targetValue: 'ghii',
          sameValue: false,
          sameValueZero: false,

          retrievedId: null,

          sourceOrder: 1,
          targetOrder: 0,
          sameOrder: false,

          sourceType: 'string',
          targetType: 'string',
          sameType: true,

          added: false,
          removed: false,
          changed: true,

          children: null,
        },
        {
          sourcePath: null,
          targetPath: [3],
          sourceValue: undefined,
          targetValue: 'zzz',
          sameValue: false,
          sameValueZero: false,

          retrievedId: null,

          sourceOrder: null,
          targetOrder: 3,
          sameOrder: false,

          sourceType: 'undefined',
          targetType: 'string',
          sameType: false,

          added: true,
          removed: false,
          changed: true,

          children: null,
        },
      ],
    }
  ],
];

const complexArray: Tests = [
  ['compares differences in arrays of objects',
    // [{ value: 'foo', order: 0 }, { order: 1, value: 'bar' }, { order: 2, value: 'baz' }, { order: 5, value: 'removed' }],
    // [{ value: 'foo', order: 0 }, { order: 1, value: 'barrr' }, { order: 2, value: 'baz' }, { order: 10, value: 'added' }],
    [{ order: 1, value: 'bar' }, { order: 2, value: 'baz' }, { order: 5, value: 'removed' }, { value: 'foo', order: 0 }],
    [{ order: 10, value: 'added' }, { order: 1, value: 'barrr' }, { value: 'foo', order: 0 }, { order: 2, value: 'baz' }],
    {
      sourcePath: [],
      targetPath: [],
      sourceValue: [{ order: 1, value: 'bar' }, { order: 2, value: 'baz' }, { order: 5, value: 'removed' }, { value: 'foo', order: 0 }],
      targetValue: [{ order: 10, value: 'added' }, { order: 1, value: 'barrr' }, { value: 'foo', order: 0 }, { order: 2, value: 'baz' }],
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
          sourcePath: [3],
          targetPath: [2],
          sourceValue: { value: 'foo', order: 0 },
          targetValue: { value: 'foo', order: 0 },
          sameValue: true,
          sameValueZero: false,

          retrievedId: '0',

          sourceOrder: 3,
          targetOrder: 2,
          sameOrder: false,

          sourceType: 'object',
          targetType: 'object',
          sameType: true,

          added: false,
          removed: false,
          changed: false,

          children: {
            value:  {
              sourcePath: [3, 'value'],
              targetPath: [2, 'value'],
              sourceValue: 'foo',
              targetValue: 'foo',
              sameValue: true,
              sameValueZero: true,

              retrievedId: null,

              sourceOrder: 0,
              targetOrder: 0,
              sameOrder: true,

              sourceType: 'string',
              targetType: 'string',
              sameType: true,

              added: false,
              removed: false,
              changed: false,

              children: null,
            },
            order:  {
              sourcePath: [3, 'order'],
              targetPath: [2, 'order'],
              sourceValue: 0,
              targetValue: 0,
              sameValue: true,
              sameValueZero: true,

              retrievedId: null,

              sourceOrder: 1,
              targetOrder: 1,
              sameOrder: true,

              sourceType: 'number',
              targetType: 'number',
              sameType: true,

              added: false,
              removed: false,
              changed: false,

              children: null,
            },
          },
        },
        {
          sourcePath: [0],
          targetPath: [1],
          sourceValue: { order: 1, value: 'bar' },
          targetValue: { order: 1, value: 'barrr' },
          sameValue: false,
          sameValueZero: false,

          retrievedId: '1',

          sourceOrder: 0,
          targetOrder: 1,
          sameOrder: false,

          sourceType: 'object',
          targetType: 'object',
          sameType: true,

          added: false,
          removed: false,
          changed: true,

          children: {
            order:  {
              sourcePath: [0, 'order'],
              targetPath: [1, 'order'],
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
            value:  {
              sourcePath: [0, 'value'],
              targetPath: [1, 'value'],
              sourceValue: 'bar',
              targetValue: 'barrr',
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
          sourcePath: [1],
          targetPath: [3],
          sourceValue: { order: 2, value: 'baz' },
          targetValue: { order: 2, value: 'baz' },
          sameValue: true,
          sameValueZero: false,

          retrievedId: '2',

          sourceOrder: 1,
          targetOrder: 3,
          sameOrder: false,

          sourceType: 'object',
          targetType: 'object',
          sameType: true,

          added: false,
          removed: false,
          changed: false,

          children: {
            order:  {
              sourcePath: [1, 'order'],
              targetPath: [3, 'order'],
              sourceValue: 2,
              targetValue: 2,
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
            value:  {
              sourcePath: [1, 'value'],
              targetPath: [3, 'value'],
              sourceValue: 'baz',
              targetValue: 'baz',
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
        {
          sourcePath: [2],
          targetPath: null,
          sourceValue: { order: 5, value: 'removed' },
          targetValue: undefined,
          sameValue: false,
          sameValueZero: false,

          retrievedId: '5',

          sourceOrder: 2,
          targetOrder: null,
          sameOrder: false,

          sourceType: 'object',
          targetType: 'undefined',
          sameType: false,

          added: false,
          removed: true,
          changed: true,

          children: {
            order:  {
              sourcePath: [2, 'order'],
              targetPath: null,
              sourceValue: 5,
              targetValue: undefined,
              sameValue: false,
              sameValueZero: false,

              retrievedId: null,

              sourceOrder: 0,
              targetOrder: null,
              sameOrder: false,

              sourceType: 'number',
              targetType: 'undefined',
              sameType: false,

              added: false,
              removed: true,
              changed: true,

              children: null,
            },
            value:  {
              sourcePath: [2, 'value'],
              targetPath: null,
              sourceValue: 'removed',
              targetValue: undefined,
              sameValue: false,
              sameValueZero: false,

              retrievedId: null,

              sourceOrder: 1,
              targetOrder: null,
              sameOrder: false,

              sourceType: 'string',
              targetType: 'undefined',
              sameType: false,

              added: false,
              removed: true,
              changed: true,

              children: null,
            },
          },
        },

        {
          sourcePath: null,
          targetPath: [0],
          sourceValue: undefined,
          targetValue: { order: 10, value: 'added' },
          sameValue: false,
          sameValueZero: false,

          retrievedId: '10',

          sourceOrder: null,
          targetOrder: 0,
          sameOrder: false,

          sourceType: 'undefined',
          targetType: 'object',
          sameType: false,

          added: true,
          removed: false,
          changed: true,

          children: {
            order:  {
              sourcePath: null,
              targetPath: [0, 'order'],
              sourceValue: undefined,
              targetValue: 10,
              sameValue: false,
              sameValueZero: false,

              retrievedId: null,

              sourceOrder: null,
              targetOrder: 0,
              sameOrder: false,

              sourceType: 'undefined',
              targetType: 'number',
              sameType: false,

              added: true,
              removed: false,
              changed: true,

              children: null,
            },
            value:  {
              sourcePath: null,
              targetPath: [0, 'value'],
              sourceValue: undefined,
              targetValue: 'added',
              sameValue: false,
              sameValueZero: false,

              retrievedId: null,

              sourceOrder: null,
              targetOrder: 1,
              sameOrder: false,

              sourceType: 'undefined',
              targetType: 'string',
              sameType: false,

              added: true,
              removed: false,
              changed: true,

              children: null,
            },
          },
        }
      ],
    }
  ],
];

const simpleArrayOfObjects: Tests = [
  ['compares differences in arrays of objects',
    [{ order: 1, value: 'bar' }, { value: 'foo', order: 0 }],
    [{ value: 'foo', order: 0 }, { order: 1, value: 'barrr' }],
    {
      sourcePath: [],
      targetPath: [],
      sourceValue: [{ order: 1, value: 'bar' }, { value: 'foo', order: 0 }],
      targetValue: [{ value: 'foo', order: 0 }, { order: 1, value: 'barrr' }],
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
          sourcePath: [1],
          targetPath: [0],
          sourceValue: { value: 'foo', order: 0 },
          targetValue: { value: 'foo', order: 0 },
          sameValue: true,
          sameValueZero: false,

          retrievedId: '0',

          sourceOrder: 1,
          targetOrder: 0,
          sameOrder: false,

          sourceType: 'object',
          targetType: 'object',
          sameType: true,

          added: false,
          removed: false,
          changed: false,

          children: {
            value:  {
              sourcePath: [1, 'value'],
              targetPath: [0, 'value'],
              sourceValue: 'foo',
              targetValue: 'foo',
              sameValue: true,
              sameValueZero: true,

              retrievedId: null,

              sourceOrder: 0,
              targetOrder: 0,
              sameOrder: true,

              sourceType: 'string',
              targetType: 'string',
              sameType: true,

              added: false,
              removed: false,
              changed: false,

              children: null,
            },
            order:  {
              sourcePath: [1, 'order'],
              targetPath: [0, 'order'],
              sourceValue: 0,
              targetValue: 0,
              sameValue: true,
              sameValueZero: true,

              retrievedId: null,

              sourceOrder: 1,
              targetOrder: 1,
              sameOrder: true,

              sourceType: 'number',
              targetType: 'number',
              sameType: true,

              added: false,
              removed: false,
              changed: false,

              children: null,
            },
          },
        },
        {
          sourcePath: [0],
          targetPath: [1],
          sourceValue: { order: 1, value: 'bar' },
          targetValue: { order: 1, value: 'barrr' },
          sameValue: false,
          sameValueZero: false,

          retrievedId: '1',

          sourceOrder: 0,
          targetOrder: 1,
          sameOrder: false,

          sourceType: 'object',
          targetType: 'object',
          sameType: true,

          added: false,
          removed: false,
          changed: true,

          children: {
            order:  {
              sourcePath: [0, 'order'],
              targetPath: [1, 'order'],
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
            value:  {
              sourcePath: [0, 'value'],
              targetPath: [1, 'value'],
              sourceValue: 'bar',
              targetValue: 'barrr',
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
      ],
    }
  ],
];

const mixedTypeArray: Tests = [
  ['compares differences when array contains simple types and objects in the same indexes',
    [1, 2],
    [1, { foo: 2 }],
    {
      sourcePath: [],
      targetPath: [],
      sourceValue: [1, 2],
      targetValue: [1, { foo: 2 }],
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
          sourcePath: [0],
          targetPath: [0],
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
        {
          sourcePath: [1],
          targetPath: [1],
          sourceValue: 2,
          targetValue: { foo: 2 },
          sameValue: false,
          sameValueZero: false,

          retrievedId: null,

          sourceOrder: 1,
          targetOrder: 1,
          sameOrder: true,

          sourceType: 'number',
          targetType: 'object',
          sameType: false,

          added: false,
          removed: false,
          changed: true,

          children: {
            foo: {
              sourcePath: [1, 'foo'],
              targetPath: [1, 'foo'],
              sourceValue: undefined,
              targetValue: 2,
              sameValue: false,
              sameValueZero: false,

              retrievedId: null,

              sourceOrder: null,
              targetOrder: 0,
              sameOrder: false,

              sourceType: 'undefined',
              targetType: 'number',
              sameType: false,

              added: true,
              removed: false,
              changed: true,

              children: null,
            }
          },
        }
      ],
    },
  ]
];

describe('diff', () => {
  const tests = [
    ...simple,
    ...simpleObjects,
    ...simpleArray,
    ...simpleArrayOfObjects,
    ...complexArray,
    ...mixedTypeArray
  ] as const;

  for (const [testName, source, target, expected] of tests) {
    it(testName, async () => {
      const result = diff({
        sortArrayItems: true,
        getArrayElementId,
      })(source, target);
      expect(result).toEqual(expected);
    });
  }
  describe('diff views', () => {
    for (const [testName, source, target] of tests) {
      it(`jsVIew of diff which ${testName}`, async () => {
        const result = diff({
          sortArrayItems: true,
          getArrayElementId,
        })(source, target);
        expect(generateJsView(result)).toMatchSnapshot();
      });
      it(`sortedView of diff which ${testName}`, async () => {
        const result = diff({
          sortArrayItems: true,
          getArrayElementId,
        })(source, target);
        expect(generateSortedView(result)).toMatchSnapshot();
      });
    }
  });
});
