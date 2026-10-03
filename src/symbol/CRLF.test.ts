import { describe, expect, it } from 'vitest';

import { Literal, Sequence, SymbolMismatchError } from '@fundamentry/grammar';
import { CodePoint } from '@fundamentry/scalar';

import { CR } from './CR.js';
import { CRLF } from './CRLF.js';
import { LF } from './LF.js';

const cr = new CR(new Literal(CodePoint.of('\r')));
const lf = new LF(new Literal(CodePoint.of('\n')));

describe('CRLF', () => {
  it('must accept a CR followed by an LF', () => {
    expect(new CRLF(new Sequence([cr, lf] as const)).toString()).toBe('\r\n');
  });

  it('must reject an LF followed by a CR', () => {
    expect(() => new CRLF(new Sequence([lf, cr] as const))).toThrow(
      SymbolMismatchError
    );
  });
});
