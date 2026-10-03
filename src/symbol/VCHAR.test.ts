import { describe, expect, it } from 'vitest';

import { Terminal } from '@fundamentry/grammar';

import { VCHAR } from './VCHAR.js';

describe('VCHAR', () => {
  it('must be a terminal', () => {
    expect(Object.getPrototypeOf(VCHAR)).toBe(Terminal);
  });
});
