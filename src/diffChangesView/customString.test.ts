import { customString, isCustomString, join } from './customString';

describe('customString', () => {
  it('wraps string', () => {
    const value = customString('foo');

    expect(value.rawValue).toBe('foo');
    expect(value.pretty).toBe('foo');
    expect(value.toString()).toBe('foo');
  });
  it('wraps string with pretty', () => {
    const value = customString('FooBar', '\x1b[36mFooBar\x1b[0m');

    expect(value.rawValue).toBe('FooBar');
    expect(value.pretty).toBe('\x1b[36mFooBar\x1b[0m');
    expect(value.toString()).toBe('\x1b[36mFooBar\x1b[0m');
  });
  it('wraps string with pretty and representedValue', () => {
    const representedValue = { foo: 'bar' };
    const value = customString('FooBar', '\x1b[36mFooBar\x1b[0m', representedValue);

    expect(value.rawValue).toBe('FooBar');
    expect(value.pretty).toBe('\x1b[36mFooBar\x1b[0m');
    expect(value.toString()).toBe('\x1b[36mFooBar\x1b[0m');
    expect(value.representedValue).toBe(representedValue);
  });
  it('has length', () => {
    const value = customString('FooBar', '\x1b[36mFooBar\x1b[0m');

    expect(value.length).toBe(6);
  });
  it('has search', () => {
    const value = customString('FooBar', '\x1b[36mFooBar\x1b[0m');

    expect(value.search('Bar')).toBe(3);
    expect(value.search(/Bar/)).toBe(3);
  });
  it('has padEnd', () => {
    const value = customString('FooBar', '\x1b[36mFooBar\x1b[0m');

    expect(isCustomString(value.padEnd(10))).toBe(true);
    expect(value.padEnd(10).rawValue).toBe('FooBar    ');
    expect(value.padEnd(10).toString()).toBe('\x1b[36mFooBar\x1b[0m    ');
    expect(value.padEnd(10, 'x').rawValue).toBe('FooBarxxxx');
    expect(value.padEnd(10, 'x').toString()).toBe('\x1b[36mFooBar\x1b[0mxxxx');
  });
  it('has trimStart', () => {
    const value = customString('  FooBar', '  \x1b[36mFooBar\x1b[0m');

    expect(isCustomString(value.trimStart())).toBe(true);
    expect(value.trimStart().rawValue).toBe('FooBar');
    expect(value.trimStart().toString()).toBe('\x1b[36mFooBar\x1b[0m');
  });
  describe('join', () => {
    it('joins strings', () => {
      const value = join(['foo', 'bar']);

      expect(value.rawValue).toBe('foobar');
      expect(value.pretty).toBe('foobar');
      expect(value.toString()).toBe('foobar');
    });
    it('joins customStrings', () => {
      const value = join([customString('foo'), customString('bar')]);

      expect(value.rawValue).toBe('foobar');
      expect(value.pretty).toBe('foobar');
      expect(value.toString()).toBe('foobar');
    });
    it('joins strings and customStrings', () => {
      const value = join(['foo', customString('bar')]);

      expect(value.rawValue).toBe('foobar');
      expect(value.pretty).toBe('foobar');
      expect(value.toString()).toBe('foobar');
    });
    it('joins strings and customStrings with pretty', () => {
      const value = join(['foo', customString('bar', '\x1b[36mbar\x1b[0m')]);

      expect(value.rawValue).toBe('foobar');
      expect(value.pretty).toBe('foo\x1b[36mbar\x1b[0m');
      expect(value.toString()).toBe('foo\x1b[36mbar\x1b[0m');
    });
  });
});
