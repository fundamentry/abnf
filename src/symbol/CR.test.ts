import { describe, expect, it } from 'vitest';

import { Terminal } from '@fundamentry/grammar';

import { CR } from './CR.js';

describe('CR', () => {
  it('must be a terminal', () => {
    expect(Object.getPrototypeOf(CR)).toBe(Terminal);
  });
});
