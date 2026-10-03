import { describe, expect, it } from 'vitest';

import {
  Literal,
  Repetition,
  Sequence,
  SymbolMismatchError,
} from '@fundamentry/grammar';
import { CodePoint } from '@fundamentry/scalar';

import { CR } from './CR.js';
import { CRLF } from './CRLF.js';
import { LF } from './LF.js';
import { LWSP } from './LWSP.js';
import { SP } from './SP.js';
import { WSP } from './WSP.js';

type Element = WSP | Sequence<readonly [CRLF, WSP]>;

const wsp = new WSP(new SP(new Literal(CodePoint.of(' '))));

const crlf = new CRLF(
  new Sequence([
    new CR(new Literal(CodePoint.of('\r'))),
    new LF(new Literal(CodePoint.of('\n'))),
  ] as const)
);

describe('LWSP', () => {
  it.each<[string, readonly Element[], string]>([
    ['no elements', [], ''],
    ['a WSP', [wsp], ' '],
    ['a CRLF followed by a WSP', [new Sequence([crlf, wsp] as const)], '\r\n '],
  ])('must accept %s', (_, elements, text) => {
    expect(new LWSP(new Repetition(elements)).toString()).toBe(text);
  });

  it.each<[string, unknown]>([
    ['a symbol other than WSP', crlf],
    ['a WSP followed by a CRLF', new Sequence([wsp, crlf] as const)],
    ['a CRLF followed by a CRLF', new Sequence([crlf, crlf] as const)],
  ])('must reject %s', (_, element) => {
    expect(() => new LWSP(new Repetition([element as Element]))).toThrow(
      SymbolMismatchError
    );
  });
});
