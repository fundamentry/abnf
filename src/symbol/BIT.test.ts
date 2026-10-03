import { describe, expect, it } from 'vitest';

import { Terminal } from '@fundamentry/grammar';

import { BIT } from './BIT.js';

describe('BIT', () => {
  it('must be a terminal', () => {
    expect(Object.getPrototypeOf(BIT)).toBe(Terminal);
  });
});
