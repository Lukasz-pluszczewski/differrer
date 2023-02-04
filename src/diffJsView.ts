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

export const diffJsView = (diff: DiffDetails): string => {
  const createDiffView = (key: string | number | null, diff: DiffDetails, additionalIndent: number = 0, parent?: DiffDetails) => {
    let line = '';
    const indent = getIndent(additionalIndent);
    const trailingComma = key || key === 0 ? ',' : '';
    const parentType = getType(parent);

    if (diff.children && (['object', 'array'].includes(diff.sourceType) || diff.added)) {
      if (Array.isArray(diff.children)) {
        line += `[\n${diff.children.map((child, index) => createDiffView(index, child, additionalIndent + 1, diff)).join('\n')}\n${indent}]${trailingComma}`;
      } else {
        line += `{\n${Object.entries(diff.children).map(([childKey, childDiff]) => createDiffView(childKey, childDiff, additionalIndent + 1, diff)).join('\n')}\n${indent}}${trailingComma}`;
      }
      if (diff.added) {
        line += ' // +'; // adding plus after the closing braces of added objects and arrays
      } else if (diff.removed) {
        line += ' // -'; // adding minus after the closing braces of removed objects and arrays
      } else if (diff.changed) {
        line += diff.targetType !== diff.sourceType ? ` // ~ ${renderValue(diff.targetValue)}` : ' // ~'; // adding tilde after the closing braces of modified objects and arrays
      }
    } else {
      if (diff.added) {
        // for added values we put them inside a comment except for object fields
        line += parentType === 'object' ? `${renderValue(diff.targetValue)}, // +` : `// + ${renderValue(diff.targetValue)}`;
      } else {
        line += `${renderValue(diff.sourceValue)}${trailingComma}`;
      }

      if (diff.removed) {
        line += ` // -`; // adding minus in a comment after removed values
      }

      if (!diff.removed && !diff.added && diff.changed) {
        line += ` // ~ ${renderValue(diff.targetValue)}`; // adding tilde and new value in a comment after modified values
      }
    }
    return `${indent}${renderKey(key)}${line}`;
  };

  return createDiffView(null, diff, 0);
};
