import { describe, expect, it } from 'vitest';

import { Terminal } from '@fundamentry/grammar';

import { OCTET } from './OCTET.js';

describe('OCTET', () => {
  it('must be a terminal', () => {
    expect(Object.getPrototypeOf(OCTET)).toBe(Terminal);
  });
});
