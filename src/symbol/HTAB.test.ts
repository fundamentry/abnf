import { describe, expect, it } from 'vitest';

import { Terminal } from '@fundamentry/grammar';

import { HTAB } from './HTAB.js';

describe('HTAB', () => {
  it('must be a terminal', () => {
    expect(Object.getPrototypeOf(HTAB)).toBe(Terminal);
  });
});
