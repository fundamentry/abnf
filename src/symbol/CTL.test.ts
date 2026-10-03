import { describe, expect, it } from 'vitest';

import { Terminal } from '@fundamentry/grammar';

import { CTL } from './CTL.js';

describe('CTL', () => {
  it('must be a terminal', () => {
    expect(Object.getPrototypeOf(CTL)).toBe(Terminal);
  });
});
