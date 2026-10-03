import { describe, expect, it } from 'vitest';

import { Literal, SymbolMismatchError } from '@fundamentry/grammar';
import { CodePoint } from '@fundamentry/scalar';

import { ALPHA } from './ALPHA.js';
import { HTAB } from './HTAB.js';
import { SP } from './SP.js';
import { WSP } from './WSP.js';

describe('WSP', () => {
  it.each([
    ['an SP', new SP(new Literal(CodePoint.of(' ')))],
    ['an HTAB', new HTAB(new Literal(CodePoint.of('\t')))],
  ])('must accept %s', (_, element) => {
    expect(new WSP(element).toString()).toBe(element.toString());
  });

  it('must reject any other symbol', () => {
    expect(() => new WSP(new ALPHA(new Literal(CodePoint.of('a'))))).toThrow(
      SymbolMismatchError
    );
  });
});
