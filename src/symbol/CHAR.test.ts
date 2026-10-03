import { describe, expect, it } from 'vitest';

import { Terminal } from '@fundamentry/grammar';

import { CHAR } from './CHAR.js';

describe('CHAR', () => {
  it('must be a terminal', () => {
    expect(Object.getPrototypeOf(CHAR)).toBe(Terminal);
  });
});
