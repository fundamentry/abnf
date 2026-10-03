import { describe, expect, it } from 'vitest';

import { Terminal } from '@fundamentry/grammar';

import { SP } from './SP.js';

describe('SP', () => {
  it('must be a terminal', () => {
    expect(Object.getPrototypeOf(SP)).toBe(Terminal);
  });
});
