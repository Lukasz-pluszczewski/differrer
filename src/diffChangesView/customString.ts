const customStringType = Symbol('CustomString');
export type CustomString = {
  length: number,
  rawValue: string,
  pretty: string,
  toString: () => string,
  search: (patter: RegExp | string) => number,
  padEnd: (length: number, padString?: string) => CustomString,
  trimStart: () => CustomString,
  representedValue: any,
  type: Symbol,
};
export const customString = (rawValue: string, prettyArg?: string, representedValue?: any): CustomString => {
  const pretty = prettyArg === undefined ? rawValue : prettyArg;
  return {
    length: rawValue.length,
    rawValue,
    pretty,
    toString: () => pretty,
    search: (pattern: RegExp | string) => rawValue.search(pattern),
    padEnd: (length: number, padString = ' ') => {
      const paddedRawValue = rawValue.padEnd(length, padString);
      const addedLength = paddedRawValue.length - rawValue.length;
      const paddedPretty = pretty.padEnd(pretty.length + addedLength, padString);
      return customString(paddedRawValue, paddedPretty, representedValue);
    },
    trimStart: () => {
      const trimmedRawValue = rawValue.trimStart();
      const trimmedPretty = pretty.trimStart();
      return customString(trimmedRawValue, trimmedPretty, representedValue);
    },
    representedValue,
    type: customStringType,
  }
};
export const join = (customStringList: (string | CustomString)[], separator = ''): CustomString => {
  const rawValue = customStringList.map((el) => typeof el === 'string' ? el : el.rawValue).join(separator);
  const pretty = customStringList.map((el) => typeof el === 'string' ? el : el.pretty).join(separator);
  return customString(rawValue, pretty);
};
export const isCustomString = (value: any): value is CustomString => value?.type === customStringType;
