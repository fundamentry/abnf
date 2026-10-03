import { describe, expect, it } from 'vitest';

import { Terminal } from '@fundamentry/grammar';

import { LF } from './LF.js';

describe('LF', () => {
  it('must be a terminal', () => {
    expect(Object.getPrototypeOf(LF)).toBe(Terminal);
  });
});
