import { DiffDetails, getType } from './main';

const INDENT_SIZE = 2;

const getIndent = (spaces: number) => ' '.repeat(spaces * INDENT_SIZE);

const renderValue = (value: any) => {
  const valueType = getType(value);
  if (valueType === 'string') {
    return `'${value.replace(/\'/g, '\\\'')}'`;
  }
  if (['array', 'object'].includes(valueType)) {
    return JSON.stringify(value);
  }
  return `${value}`;
}

const renderKey = (key?: string | number | null) => {
  if (typeof key === 'number') {
    return '';
  }
  if (!key && key !== '') {
    return '';
  }
  if (typeof key !== 'string') {
    return '';
  }
  if (/[- ]/.test(key) || key === '') {
    return `'${key}': `;
  }
  return `${key}: `;
}

export const diffSortedView = (diff: DiffDetails) => {
  const createDiffView = (sourceOrTarget: 'source' | 'target', key: string | number | null, diff: DiffDetails, additionalIndent: number = 0, _parent?: DiffDetails, empty?: boolean) => {
    const excludeIfDiffKey = sourceOrTarget === 'source' ? 'added' : 'removed';
    const valueKey = sourceOrTarget === 'source' ? 'sourceValue' : 'targetValue';
    const typeKey = sourceOrTarget === 'source' ? 'sourceType' : 'targetType';


    const indent = getIndent(additionalIndent);
    const trailingComma = key || key === 0 ? ',' : '';
    let line = '';

    if (diff[excludeIfDiffKey] || empty || (diff.children && !['array', 'object'].includes(diff[typeKey]))) {
      const nonObjectValue = (diff.children && !['array', 'object', 'undefined'].includes(diff[typeKey])) ? `${indent}${diff[valueKey]}${trailingComma}` : '';
      if (diff.children) {
        if (Array.isArray(diff.children)) {
          line += `${nonObjectValue}\n${diff.children.map((child, index) => createDiffView(sourceOrTarget, index, child, additionalIndent + 1, diff, empty)).join('\n')}\n`;
        } else {
          line += `${nonObjectValue}\n${Object.entries(diff.children).map(([childKey, childDiff]) => createDiffView(sourceOrTarget, childKey, childDiff, additionalIndent + 1, diff, empty)).join('\n')}\n`;
        }
      }
      return line;
    }


    if (diff.children) {
      if (Array.isArray(diff.children)) {
        line += `[\n${diff.children.map((child, index) => createDiffView(sourceOrTarget, index, child, additionalIndent + 1, diff)).join('\n')}\n${indent}]${trailingComma}`;
      } else {
        line += `{\n${Object.entries(diff.children).map(([childKey, childDiff]) => createDiffView(sourceOrTarget, childKey, childDiff, additionalIndent + 1, diff)).join('\n')}\n${indent}}${trailingComma}`;
      }
    } else {
      line += `${renderValue(diff[valueKey])}${trailingComma}`;
    }
    return `${indent}${renderKey(key)}${line}`;
  };

  return {
    source: createDiffView('source', null, diff, 0),
    target: createDiffView('target', null, diff, 0),
  };
};
