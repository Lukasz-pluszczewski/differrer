import { DiffDetails } from '../main';
import { customString, join, CustomString, isCustomString } from './customString';

const INDENT_SIZE = 2;

const ADDITIONAL_VALUE_ROW_INDENT = 0;
const ADDITIONAL_PADDINGS = 0;

const isNode =
  typeof process !== "undefined" &&
  process.versions != null &&
  process.versions.node != null;

const inspect = (value: any): CustomString => {
  if (isNode && typeof require !== 'undefined') {
    return customString(
      require('util').inspect(value, { colors: false }),
      require('util').inspect(value, { colors: true }),
      value
    );
  }
  const escaped = typeof value === 'string' ? `'${value.replace(/'/g, '\\\'')}'` : `${value}`;
  return customString(
    escaped,
    escaped,
    value,
  );
};


const renderKey = (key: any, prefix = ''): CustomString => {
  if (typeof key === 'number') {
    const keyString = inspect(key);
    return join(['[', keyString, ']']);
  }
  if (!key && key !== '') {
    return customString('');
  }
  if (typeof key !== 'string') {
    return customString('');
  }
  if (/[- ]/.test(key) || key === '') {
    return customString(`${prefix}'${key}'`);
  }
  return customString(`${prefix}${key}`);
};

const renderPath = (path: (string|number)[]): CustomString => {
  let addDot = false;

  return join(path.map((element) => {
    if(typeof element === 'number') {
      addDot = false;
      return renderKey(element);
    }
    if (addDot) {
      return renderKey(element, '.');
    }
    addDot = true;
    return renderKey(element);
  }));
};
const indent = (level: number) => {
  return ' '.repeat((level ? level - 1 : level) * INDENT_SIZE);
};
const getLastElement = <T>(array: T[] | null): T | null => array ? array[array.length - 1] : null;

type FoundDifference = [path: CustomString, sourceValue: CustomString, targetValue: CustomString, pathMaxLength?: number, sourceMaxLength?: number, targetMaxLength?: number] | CustomString;
const getLongestString = (list: FoundDifference[], index: number | null, additionalPadding = 0) => {
  return list.reduce((acc, el) => {
    let length;
    if (isCustomString(el)) {
      length = index === null ? el.length : 0;
    } else {
      const value = index !== null ? el[index] : null;
      length = index !== null && isCustomString(value) ? value.length : 0;
    }
    return length > acc ? length : acc;
  }, 0) + additionalPadding;
};
const getLongestIndent = (list: FoundDifference[], index: number | null, additionalPadding = 0) => {
  const nonWhitspaceOrEndOfStringPattern = /\S|$/;
  return list.reduce((acc, el) => {
    let length;
    if (isCustomString(el)) {
      length = index === null ? el.search(nonWhitspaceOrEndOfStringPattern) : 0;
    } else {
      length = index === null ? 0 : inspect(el[index]).search(nonWhitspaceOrEndOfStringPattern);
    }
    return length > acc ? length : acc;
  }, 0) + additionalPadding;
};

const searchDiff = (diff: DiffDetails, level = 0): FoundDifference[] => {
  if (diff.sameValue) {
    return [] as FoundDifference[];
  }
  if (diff.children) {
    const childrenDifferences = (Array.isArray(diff.children)
      ? diff.children.map<[number, DiffDetails]>((el, index) => [index, el])
      : Object.entries<DiffDetails>(diff.children)).flatMap(([, value]) => {
        return searchDiff(value, level + 1);
    });
    if (childrenDifferences.length > 0) {
      const header = diff.retrievedId || getLastElement(diff.sourcePath) || getLastElement(diff.targetPath);
      const pathMaxLength = getLongestString(childrenDifferences, 0, ADDITIONAL_PADDINGS + ADDITIONAL_VALUE_ROW_INDENT * INDENT_SIZE);
      const sourceMaxLength = getLongestString(childrenDifferences, 1, ADDITIONAL_PADDINGS);
      const targetMaxLength = getLongestString(childrenDifferences, 2, ADDITIONAL_PADDINGS);
      return [
        header ? customString(`${indent(level)}${header}`) : customString(''),
        ...childrenDifferences.map((el): FoundDifference => (isCustomString(el) ? el : [el[0], el[1], el[2], pathMaxLength, sourceMaxLength, targetMaxLength]))
      ];
    }
    return [];
  }
  return [[
    join([indent(level), renderPath(diff.sourcePath || diff.targetPath || [])]),
    inspect(diff.sourceValue),
    inspect(diff.targetValue),
  ]];
}


export const diffChangesViewConsole = (diff: DiffDetails) => {
  const differences = searchDiff(diff);
  const maxIndent = getLongestIndent(differences, null, ADDITIONAL_VALUE_ROW_INDENT);
  return differences.map(foundDifference => {
    if (isCustomString(foundDifference)) {
      return foundDifference.pretty;
    } else {
      const [pathRaw, sourceValueRaw, targetValueRaw, pathMaxLength, sourceMaxLength, targetMaxlength] = foundDifference;
      const path = join([indent(maxIndent + 1), pathRaw.trimStart()])
        .padEnd(pathMaxLength || 0);
      const sourceValue = sourceValueRaw.padEnd(sourceMaxLength || 0);
      const targetValue = targetValueRaw.padEnd(targetMaxlength || 0);

      return `${path}: ${sourceValue} -> ${targetValue}`;
    }
  }).join('\n');
};

export const diffChangesViewRaw = (diff: DiffDetails) => {
  const differences = searchDiff(diff);
  return differences.map(foundDifference => {
    if (isCustomString(foundDifference)) {
      return foundDifference.rawValue;
    } else {
      const [path, sourceValue, targetValue] = foundDifference;
      return [path.rawValue, sourceValue.rawValue, targetValue.rawValue];
    }
  }).filter(el => el);
}
