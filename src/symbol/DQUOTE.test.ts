import { describe, expect, it } from 'vitest';

import { Terminal } from '@fundamentry/grammar';

import { DQUOTE } from './DQUOTE.js';

describe('DQUOTE', () => {
  it('must be a terminal', () => {
    expect(Object.getPrototypeOf(DQUOTE)).toBe(Terminal);
  });
});
