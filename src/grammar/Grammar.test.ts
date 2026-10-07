import { describe, expect, it } from 'vitest';

import {
  alpha,
  bit,
  char,
  cr,
  crlf,
  ctl,
  digit,
  dquote,
  hexdig,
  htab,
  lf,
  lwsp,
  octet,
  sp,
  vchar,
  wsp,
} from './Grammar.js';

describe('Grammar', () => {
  it('must define ALPHA', () => {
    expect(Array.from(alpha.definitions(), String)).toEqual([
      'ALPHA = %x41-5A / %x61-7A',
    ]);
  });

  it('must define BIT', () => {
    expect(Array.from(bit.definitions(), String)).toEqual(['BIT = "0" / "1"']);
  });

  it('must define CHAR', () => {
    expect(Array.from(char.definitions(), String)).toEqual(['CHAR = %x01-7F']);
  });

  it('must define CR', () => {
    expect(Array.from(cr.definitions(), String)).toEqual(['CR = %x0D']);
  });

  it('must define CRLF', () => {
    expect(Array.from(crlf.definitions(), String)).toEqual([
      'CRLF = CR LF',
      'CR = %x0D',
      'LF = %x0A',
    ]);
  });

  it('must define CTL', () => {
    expect(Array.from(ctl.definitions(), String)).toEqual([
      'CTL = %x00-1F / %x7F',
    ]);
  });

  it('must define DIGIT', () => {
    expect(Array.from(digit.definitions(), String)).toEqual([
      'DIGIT = %x30-39',
    ]);
  });

  it('must define DQUOTE', () => {
    expect(Array.from(dquote.definitions(), String)).toEqual(['DQUOTE = %x22']);
  });

  it('must define HEXDIG', () => {
    expect(Array.from(hexdig.definitions(), String)).toEqual([
      'HEXDIG = DIGIT / "A" / "B" / "C" / "D" / "E" / "F"',
      'DIGIT = %x30-39',
    ]);
  });

  it('must define HTAB', () => {
    expect(Array.from(htab.definitions(), String)).toEqual(['HTAB = %x09']);
  });

  it('must define LF', () => {
    expect(Array.from(lf.definitions(), String)).toEqual(['LF = %x0A']);
  });

  it('must define LWSP', () => {
    expect(Array.from(lwsp.definitions(), String)).toEqual([
      'LWSP = *(WSP / CRLF WSP)',
      'WSP = SP / HTAB',
      'CRLF = CR LF',
      'SP = %x20',
      'HTAB = %x09',
      'CR = %x0D',
      'LF = %x0A',
    ]);
  });

  it('must define OCTET', () => {
    expect(Array.from(octet.definitions(), String)).toEqual([
      'OCTET = %x00-FF',
    ]);
  });

  it('must define SP', () => {
    expect(Array.from(sp.definitions(), String)).toEqual(['SP = %x20']);
  });

  it('must define VCHAR', () => {
    expect(Array.from(vchar.definitions(), String)).toEqual([
      'VCHAR = %x21-7E',
    ]);
  });

  it('must define WSP', () => {
    expect(Array.from(wsp.definitions(), String)).toEqual([
      'WSP = SP / HTAB',
      'SP = %x20',
      'HTAB = %x09',
    ]);
  });
});
