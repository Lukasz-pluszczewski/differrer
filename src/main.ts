export { diffJsView } from './diffJsView/diffJsView';
export { diffSortedView } from './diffSortedView/diffSortedView';
export { diffChangesViewConsole, diffChangesViewRaw } from './diffChangesView/diffChangesView';

const sortIds = (ids: (string|number)[]) =>
  ids.sort(
    (a, b) => `${a}`.localeCompare(`${b}`, undefined, { numeric: true })
  );
const groupArrayByType = (array: [number, (null | undefined | string | number | boolean | object | unknown[])][]) => ({
  number: array.filter(el => typeof el[1] === 'number') as [number, number][],
  string: array.filter(el => typeof el[1] === 'string') as [number, string][],
  booleanTrue: array.filter(el => el[1] === true) as [number, boolean][],
  booleanFalse: array.filter(el => el[1] === false) as [number, boolean][],
  null: array.filter(el => el[1] === null) as [number, null][],
  undefined: array.filter(el => el[1] === undefined) as [number, undefined][],
  object: array.filter(el => isPlainObject(el[1])) as [number, object][],
  array: array.filter(el => Array.isArray(el[1])) as [number, unknown[]][],
});
const sortArray = (array: [number, (null | undefined | string | number | boolean | object | unknown[])][]): [number, (null | undefined | string | number | boolean | object | unknown[])][] => {
  const grouped = groupArrayByType(array);
  return [
    ...grouped.number.sort((a, b) => a[1] - b[1]),
    ...grouped.string.sort((a, b) => a[1].localeCompare(b[1], undefined, { numeric: true })),
    ...grouped.booleanTrue,
    ...grouped.booleanFalse,
    ...grouped.null,
    ...grouped.undefined,
    ...grouped.object,
    ...grouped.array,
  ];
}

const uniq = <T extends unknown>(arr: T[]): T[] =>
  arr.filter((el, index) => index === arr.indexOf(el));

const isEqualZero = (x: any, y: any) => {
  if (typeof x === "number" && typeof y === "number") {
    return x === y || (x !== x && y !== y);
  }
  return x === y;
};
export const isPlainObject = (value: any): value is Record<string, unknown> => (
  Object.prototype.toString.call(value) === '[object Object]' && (
    value.constructor === undefined || (
      Object.prototype.toString.call(value.constructor.prototype) === '[object Object]'
      && value.constructor.prototype.hasOwnProperty('isPrototypeOf')
    )
  )
);
export const getType = (value: any) => {
  switch (true) {
    case isPlainObject(value):
      return 'object';
    case Array.isArray(value):
      return 'array';
    case typeof value === 'string':
      return 'string';
    case typeof value === 'number':
      return 'number';
    case typeof value === 'boolean':
      return 'boolean';
    case value === null:
      return 'null';
    case value === undefined:
      return 'undefined';
    default:
      return 'unknown';
  }
};

export type GetArrayElementId = (value: unknown, path: (string|number)[] | null, parent?: unknown) => unknown;
export type ValueForDiff = null | undefined | string | number | boolean | ValueForDiff[] | { [key: string]: ValueForDiff };
export type DiffDetails = {
  sourcePath: (string|number)[] | null,
  targetPath: (string|number)[] | null,
  sourceValue: ValueForDiff,
  targetValue: ValueForDiff,
  sameValue: boolean,
  sameValueZero: boolean,

  retrievedId: string | number | null,

  sourceOrder: string | number | null,
  targetOrder: string | number | null,
  sameOrder: boolean | null,

  sourceType: string,
  targetType: string,
  sameType: boolean,

  added: boolean,
  removed: boolean,
  changed: boolean,

  children: DiffDetails[] | { [key: string]: DiffDetails } | null,
};
export type DiffOptions = {
  sortArrayItems?: boolean,
  getArrayElementId: GetArrayElementId,
};

export const getArrayElementIdWrapper = (getArrayElementId: GetArrayElementId) => (value: unknown, path: (string|number)[] | null, parent?: unknown) => {
  const result = getArrayElementId(value, path, parent);
  if (typeof result === 'string' || typeof result === 'number') {
    return result;
  }
  return null;
};

export const diff = ({
  sortArrayItems = false,
  getArrayElementId: getArrayElementIdRaw,
}: DiffOptions) => (source: ValueForDiff, target: ValueForDiff): DiffDetails => {
  const getArrayElementId = getArrayElementIdWrapper(getArrayElementIdRaw);
  const createDiff = (
    sourcePath: (string|number)[] | null = [],
    targetPath: (string|number)[] | null = [],
    sourceOrder: string | number | null = null,
    targetOrder: string | number | null = null,
    sourceValue: ValueForDiff,
    targetValue: ValueForDiff
  ): DiffDetails => {
    const sourceType = getType(sourceValue);
    const targetType = getType(targetValue);

    const diffResults: DiffDetails = {
      sourcePath,
      targetPath,
      sourceValue,
      targetValue,
      sameValue: true,
      sameValueZero: true,

      retrievedId: null,

      sourceOrder,
      targetOrder,
      sameOrder: sourceOrder === null && targetOrder === null ? null : sourceOrder === targetOrder,

      sourceType,
      targetType,
      sameType: sourceType === targetType,

      added: false,
      removed: false,
      changed: false,

      children: null,
    };

    if (sourceType === 'object' || targetType === 'object') {
      const sourceIsObject = sourceType === 'object';
      const targetIsObject = targetType === 'object';
      const sourceKeys = sourceIsObject ? Object.keys(sourceValue as Record<string, any>) : null;
      const targetKeys = targetIsObject ? Object.keys(targetValue as Record<string, any>) : null;
      const allKeys = uniq([...(sourceKeys || []), ...(targetKeys || [])]);

      const children = allKeys.reduce<{[key: string]: DiffDetails}>((acc, key) => {
        const sourceChild = sourceIsObject ? (sourceValue as Record<string, any>)[key] : undefined;
        const targetChild = targetIsObject ? (targetValue as Record<string, any>)[key] : undefined;
        const sourceOrder = sourceKeys ? sourceKeys.indexOf(key) : -1;
        const targetOrder = targetKeys ? targetKeys.indexOf(key) : -1;
        const childDiffResults = createDiff(
          sourcePath ? [...sourcePath as (string|number)[], key] : null,
          targetPath ? [...targetPath as (string|number)[], key] : null,
          sourceOrder === -1 ? null : sourceOrder,
          targetOrder === -1 ? null : targetOrder,
          sourceChild,
          targetChild
        );

        diffResults.sameValue = diffResults.sameValue && childDiffResults.sameValue;
        childDiffResults.added = sourceOrder === -1;
        childDiffResults.removed = targetOrder === -1;

        acc[key] = childDiffResults;
        return acc;
      }, {} as { [key: string]: DiffDetails });
      diffResults.children = children;
    } else if (sourceType === 'array' || targetType === 'array') {
      const sourceIsArray = sourceType === 'array';
      const targetIsArray = targetType === 'array';
      const sourceNonIdElementsRaw: [index: number, value: any][] = [];
      const sourceId2Value: Record<string | number, [index: number | string, value: any]> = {};
      const sourceIndex2Id: Record<number, string | number> = {};
      (sourceIsArray ? sourceValue as any[] : []).forEach((value, index) => {
        const id = ['object', 'array'].includes(getType(value)) ? getArrayElementId(value, sourcePath ? [...sourcePath, index] : null) : null;
        if (id || id === 0 || id === '') {
          sourceId2Value[id] = [index, value];
          sourceIndex2Id[index] = id;
        } else {
          sourceNonIdElementsRaw.push([index, value]);
        }
      });

      const targetNonIdElementsRaw: [index: number, value: any][] = [];
      const targetId2Value: Record<string | number, [index: number | string, value: any]> = {};
      const targetIndex2Id: Record<number, string | number> = {};
      (targetIsArray ? targetValue as any[] : []).forEach((value, index) => {
        const id = ['object', 'array'].includes(getType(value)) ? getArrayElementId(value, targetPath ? [...targetPath, index] : null) : null;
        if (id || id === 0 || id === '') {
          targetId2Value[id] = [index, value];
          targetIndex2Id[index] = id;
        } else {
          targetNonIdElementsRaw.push([index, value]);
        }
      });

      const allIds = sortIds(uniq([...Object.keys(sourceId2Value), ...Object.keys(targetId2Value)]));

      const childrenWithIds = allIds.map(id => {
        const [sourceOrder, sourceChild] = sourceId2Value[id] || [null, undefined];
        const [targetOrder, targetChild] = targetId2Value[id] || [null, undefined];
        const childDiffResults = createDiff(
          sourceOrder === null || !sourcePath ? null : [...sourcePath, sourceOrder],
          targetOrder === null || !targetPath ? null : [...targetPath, targetOrder],
          sourceOrder,
          targetOrder,
          sourceChild,
          targetChild
        );

        childDiffResults.retrievedId = id;

        diffResults.sameValue = diffResults.sameValue && childDiffResults.sameValue;
        childDiffResults.added = Boolean(!sourceId2Value[id] && targetId2Value[id]);
        childDiffResults.removed = Boolean(sourceId2Value[id] && !targetId2Value[id]);

        return childDiffResults;
      });

      const sourceNonIdElements = sortArrayItems ? sortArray(sourceNonIdElementsRaw) : sourceNonIdElementsRaw;
      const targetNonIdElements = sortArrayItems ? sortArray(targetNonIdElementsRaw) : targetNonIdElementsRaw;

      const sourceNonIdElementsOriginalIndexMap = sourceNonIdElements.reduce<Record<number, number>>((acc, [originalIndex], index) => ({
        ...acc,
        [originalIndex]: index,
      }), {});
      const targetNonIdElementsOriginalIndexMap = targetNonIdElements.reduce<Record<number, number>>((acc, [originalIndex], index) => ({
        ...acc,
        [originalIndex]: index,
      }), {});

      const maxNonIdLength = Math.max(sourceNonIdElements.length, targetNonIdElements.length);
      const childrenWithoutIds: DiffDetails[] = [];
      const getCurrentIndex = (
        index: number,
        sortArrayItems: boolean,
        sourceElements: ([originalIndex: number, value: any])[],
        targetElements: ([originalIndex: number, value: any])[]
      ) => {
        if (sortArrayItems) {
          return [index, index];
        }
        if (sourceElements[index]) {
          return [index, targetNonIdElementsOriginalIndexMap[sourceElements[index][0]]];
        }
        return [sourceNonIdElementsOriginalIndexMap[targetElements[index][0]], index];
      };
      Array(maxNonIdLength).fill(null).forEach((_, index) => {
        const [sourceIndex, targetIndex] = getCurrentIndex(index, sortArrayItems, sourceNonIdElements, targetNonIdElements);
        const sourceNonIdElement = ((sourceIndex || sourceIndex === 0) && sourceNonIdElements[sourceIndex]) || [null, undefined];
        const targetNonIdElement = ((targetIndex || targetIndex === 0) && targetNonIdElements[targetIndex]) || [null, undefined];
        const childDiffResults = createDiff(
          sourceNonIdElement[0] === null || !sourcePath ? null : [...sourcePath, sourceNonIdElement[0]],
          targetNonIdElement[0] === null || !targetPath ? null : [...targetPath, targetNonIdElement[0]],
          sourceNonIdElement[0],
          targetNonIdElement[0],
          sourceNonIdElement[1],
          targetNonIdElement[1]
        );

        diffResults.sameValue = diffResults.sameValue && childDiffResults.sameValue;
        childDiffResults.added = sourceNonIdElement[0] === null && targetNonIdElement[0] !== null;
        childDiffResults.removed = sourceNonIdElement[0] !== null && targetNonIdElement[0] === null;

        childrenWithoutIds.push(childDiffResults);
      });

      diffResults.children = [
        ...childrenWithIds,
        ...childrenWithoutIds,
      ];
    } else {
      diffResults.sameValue = sourceValue === targetValue;
    }
    diffResults.sameValueZero = isEqualZero(sourceValue, targetValue);

    diffResults.changed = !diffResults.sameValue;

    return diffResults;
  };

  return createDiff(
    [],
    [],
    null,
    null,
    source,
    target
  );
};

export default diff;
