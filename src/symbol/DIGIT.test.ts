import { describe, expect, it } from 'vitest';

import { Terminal } from '@fundamentry/grammar';

import { DIGIT } from './DIGIT.js';

describe('DIGIT', () => {
  it('must be a terminal', () => {
    expect(Object.getPrototypeOf(DIGIT)).toBe(Terminal);
  });
});
