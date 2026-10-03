import { describe, expect, it } from 'vitest';

import { Literal, SymbolMismatchError } from '@fundamentry/grammar';
import { CodePoint } from '@fundamentry/scalar';

import { ALPHA } from './ALPHA.js';
import { DIGIT } from './DIGIT.js';
import { HEXDIG } from './HEXDIG.js';

describe('HEXDIG', () => {
  it('must accept a DIGIT', () => {
    expect(
      new HEXDIG(new DIGIT(new Literal(CodePoint.of('7')))).toString()
    ).toBe('7');
  });

  it.each(['A', 'F', 'a', 'f'])("must accept the literal '%s'", letter => {
    expect(new HEXDIG(new Literal(CodePoint.of(letter))).toString()).toBe(
      letter
    );
  });

  it.each(['G', 'g', '7'])("must reject the literal '%s'", char => {
    expect(() => new HEXDIG(new Literal(CodePoint.of(char)))).toThrow(
      SymbolMismatchError
    );
  });

  it('must reject a symbol other than DIGIT', () => {
    expect(() => new HEXDIG(new ALPHA(new Literal(CodePoint.of('a'))))).toThrow(
      SymbolMismatchError
    );
  });
});
