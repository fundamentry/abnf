import { describe, expect, it } from 'vitest';

import { Terminal } from '@fundamentry/grammar';

import { ALPHA } from './ALPHA.js';

describe('ALPHA', () => {
  it('must be a terminal', () => {
    expect(Object.getPrototypeOf(ALPHA)).toBe(Terminal);
  });
});
