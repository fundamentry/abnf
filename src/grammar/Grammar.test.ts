import { describe, expect, it } from 'vitest';

import { Matched, Unmatched } from '@fundamentry/grammar';
import { Range } from '@fundamentry/range';
import { codePoint } from '@fundamentry/scalar';
import { Tape } from '@fundamentry/stream';

import { Grammar } from './Grammar.js';

const input = (value: string) => new Tape(Array.from(value, codePoint));

describe('Grammar', () => {
  const grammar = new Grammar();

  describe('terminal', () => {
    it('must match a character within a single range', () => {
      const recognition = grammar
        .terminal(Range.closed(codePoint(0x61), codePoint(0x7a)))
        .derive(input('m'));

      expect(recognition).toBeInstanceOf(Matched);

      if (recognition instanceof Matched)
        expect(recognition.value().toString()).toBe('m');
    });

    it('must not match a character outside every given range', () => {
      const recognition = grammar
        .terminal(Range.closed(codePoint(0x61), codePoint(0x7a)))
        .derive(input('A'));

      expect(recognition).toBeInstanceOf(Unmatched);
    });

    it.each(['5', 'z'])(
      "must match '%s', covered by one of several ranges",
      char => {
        const recognition = grammar
          .terminal(
            Range.closed(codePoint(0x30), codePoint(0x39)),
            Range.closed(codePoint(0x61), codePoint(0x7a))
          )
          .derive(input(char));

        expect(recognition).toBeInstanceOf(Matched);
      }
    );

    it('must not match a character outside every given range in a multi-range terminal', () => {
      const recognition = grammar
        .terminal(
          Range.closed(codePoint(0x30), codePoint(0x39)),
          Range.closed(codePoint(0x61), codePoint(0x7a))
        )
        .derive(input('Z'));

      expect(recognition).toBeInstanceOf(Unmatched);
    });

    it('must not match a raw string tape element that is not a code point', () => {
      const recognition = grammar
        .terminal(Range.closed(codePoint(0x00), codePoint(0x10ffff)))
        .derive(new Tape(['a']));

      expect(recognition).toBeInstanceOf(Unmatched);
    });

    it('must match a full astral character represented as a single code point', () => {
      const recognition = grammar
        .terminal(Range.singleton(codePoint(0x1f600)))
        .derive(input('😀'));

      expect(recognition).toBeInstanceOf(Matched);

      if (recognition instanceof Matched)
        expect(recognition.value().toString()).toBe('😀');
    });
  });

  describe('alpha', () => {
    it.each(['a', 'z', 'A', 'Z'])("must match the letter '%s'", letter => {
      const recognition = grammar.alpha().derive(input(letter));

      expect(recognition).toBeInstanceOf(Matched);

      if (recognition instanceof Matched)
        expect(recognition.value().toString()).toBe(letter);
    });

    it('must not match a digit', () => {
      const recognition = grammar.alpha().derive(input('1'));

      expect(recognition).toBeInstanceOf(Unmatched);
    });

    it('must not match a raw tape element that is not a code point', () => {
      const recognition = grammar.alpha().derive(new Tape(['']));

      expect(recognition).toBeInstanceOf(Unmatched);
    });

    it('must not match a lone surrogate passed as a raw tape element, instead of throwing', () => {
      const recognition = grammar.alpha().derive(new Tape(['\ud83d']));

      expect(recognition).toBeInstanceOf(Unmatched);
    });

    it('must throw while building the tape from input containing a lone surrogate', () => {
      expect(() => input('\ud83d')).toThrow(RangeError);
    });
  });

  describe('bit', () => {
    it.each(['0', '1'])("must match '%s'", bit => {
      const recognition = grammar.bit().derive(input(bit));

      expect(recognition).toBeInstanceOf(Matched);

      if (recognition instanceof Matched)
        expect(recognition.value().toString()).toBe(bit);
    });

    it('must not match a digit outside 0-1', () => {
      const recognition = grammar.bit().derive(input('5'));

      expect(recognition).toBeInstanceOf(Unmatched);
    });
  });

  describe('char', () => {
    it.each(['\x01', '\x7f'])("must match the boundary '%s'", char => {
      const recognition = grammar.char().derive(input(char));

      expect(recognition).toBeInstanceOf(Matched);

      if (recognition instanceof Matched)
        expect(recognition.value().toString()).toBe(char);
    });

    it('must match a letter already recognized by another rule', () => {
      const recognition = grammar.char().derive(input('a'));

      expect(recognition).toBeInstanceOf(Matched);
    });

    it('must not match NUL', () => {
      const recognition = grammar.char().derive(input('\x00'));

      expect(recognition).toBeInstanceOf(Unmatched);
    });

    it('must not match a raw tape element containing more than one code point', () => {
      const recognition = grammar.char().derive(new Tape(['ab']));

      expect(recognition).toBeInstanceOf(Unmatched);
    });
  });

  describe('cr', () => {
    it('must match a carriage return', () => {
      const recognition = grammar.cr().derive(input('\r'));

      expect(recognition).toBeInstanceOf(Matched);

      if (recognition instanceof Matched)
        expect(recognition.value().toString()).toBe('\r');
    });

    it('must not match a linefeed', () => {
      const recognition = grammar.cr().derive(input('\n'));

      expect(recognition).toBeInstanceOf(Unmatched);
    });
  });

  describe('crlf', () => {
    it('must match a carriage return followed by a linefeed', () => {
      const recognition = grammar.crlf().derive(input('\r\n'));

      expect(recognition).toBeInstanceOf(Matched);

      if (recognition instanceof Matched)
        expect(recognition.value()).toBe('\r\n');
    });

    it('must not match a carriage return without a following linefeed', () => {
      const recognition = grammar.crlf().derive(input('\r'));

      expect(recognition).toBeInstanceOf(Unmatched);
    });

    it('must not match a linefeed followed by a carriage return', () => {
      const recognition = grammar.crlf().derive(input('\n\r'));

      expect(recognition).toBeInstanceOf(Unmatched);
    });
  });

  describe('ctl', () => {
    it.each(['\x00', '\x1f', '\x7f'])("must match '%s'", char => {
      const recognition = grammar.ctl().derive(input(char));

      expect(recognition).toBeInstanceOf(Matched);

      if (recognition instanceof Matched)
        expect(recognition.value().toString()).toBe(char);
    });

    it('must match a carriage return already recognized by another rule', () => {
      const recognition = grammar.ctl().derive(input('\r'));

      expect(recognition).toBeInstanceOf(Matched);
    });

    it('must not match a space', () => {
      const recognition = grammar.ctl().derive(input(' '));

      expect(recognition).toBeInstanceOf(Unmatched);
    });
  });

  describe('digit', () => {
    it.each(['0', '9'])("must match the digit '%s'", digit => {
      const recognition = grammar.digit().derive(input(digit));

      expect(recognition).toBeInstanceOf(Matched);

      if (recognition instanceof Matched)
        expect(recognition.value().toString()).toBe(digit);
    });

    it('must not match a letter', () => {
      const recognition = grammar.digit().derive(input('a'));

      expect(recognition).toBeInstanceOf(Unmatched);
    });
  });

  describe('dquote', () => {
    it('must match a double quote', () => {
      const recognition = grammar.dquote().derive(input('"'));

      expect(recognition).toBeInstanceOf(Matched);

      if (recognition instanceof Matched)
        expect(recognition.value().toString()).toBe('"');
    });

    it('must not match an apostrophe', () => {
      const recognition = grammar.dquote().derive(input("'"));

      expect(recognition).toBeInstanceOf(Unmatched);
    });
  });

  describe('hexdig', () => {
    it.each(['0', '9', 'a', 'f', 'A', 'F'])("must match '%s'", char => {
      const recognition = grammar.hexdig().derive(input(char));

      expect(recognition).toBeInstanceOf(Matched);

      if (recognition instanceof Matched)
        expect(recognition.value().toString()).toBe(char);
    });

    it.each(['g', 'G'])("must not match '%s'", char => {
      const recognition = grammar.hexdig().derive(input(char));

      expect(recognition).toBeInstanceOf(Unmatched);
    });
  });

  describe('htab', () => {
    it('must match a horizontal tab', () => {
      const recognition = grammar.htab().derive(input('\t'));

      expect(recognition).toBeInstanceOf(Matched);

      if (recognition instanceof Matched)
        expect(recognition.value().toString()).toBe('\t');
    });

    it('must not match a space', () => {
      const recognition = grammar.htab().derive(input(' '));

      expect(recognition).toBeInstanceOf(Unmatched);
    });
  });

  describe('lf', () => {
    it('must match a linefeed', () => {
      const recognition = grammar.lf().derive(input('\n'));

      expect(recognition).toBeInstanceOf(Matched);

      if (recognition instanceof Matched)
        expect(recognition.value().toString()).toBe('\n');
    });

    it('must not match a carriage return', () => {
      const recognition = grammar.lf().derive(input('\r'));

      expect(recognition).toBeInstanceOf(Unmatched);
    });
  });

  describe('lwsp', () => {
    it('must match zero repetitions as an empty string', () => {
      const recognition = grammar.lwsp().derive(input(''));

      expect(recognition).toBeInstanceOf(Matched);

      if (recognition instanceof Matched) expect(recognition.value()).toBe('');
    });

    it('must match a single space', () => {
      const recognition = grammar.lwsp().derive(input(' '));

      expect(recognition).toBeInstanceOf(Matched);

      if (recognition instanceof Matched) expect(recognition.value()).toBe(' ');
    });

    it('must match consecutive whitespace characters', () => {
      const recognition = grammar.lwsp().derive(input(' \t'));

      expect(recognition).toBeInstanceOf(Matched);

      if (recognition instanceof Matched)
        expect(recognition.value()).toBe(' \t');
    });

    it('must match a folded CRLF WSP sequence', () => {
      const recognition = grammar.lwsp().derive(input('\r\n '));

      expect(recognition).toBeInstanceOf(Matched);

      if (recognition instanceof Matched)
        expect(recognition.value()).toBe('\r\n ');
    });

    it('must match a space followed by a folded CRLF WSP sequence', () => {
      const recognition = grammar.lwsp().derive(input(' \r\n\t'));

      expect(recognition).toBeInstanceOf(Matched);

      if (recognition instanceof Matched)
        expect(recognition.value()).toBe(' \r\n\t');
    });

    it('must match an empty string when the input does not start with whitespace', () => {
      const recognition = grammar.lwsp().derive(input('x'));

      expect(recognition).toBeInstanceOf(Matched);

      if (recognition instanceof Matched) expect(recognition.value()).toBe('');
    });

    it('must not consume a trailing CR that is not followed by an LF and WSP', () => {
      const recognition = grammar.lwsp().derive(input(' \r'));

      expect(recognition).toBeInstanceOf(Matched);

      if (recognition instanceof Matched) expect(recognition.value()).toBe(' ');
    });
  });

  describe('octet', () => {
    it.each(['\x00', '\xff'])("must match '%s'", char => {
      const recognition = grammar.octet().derive(input(char));

      expect(recognition).toBeInstanceOf(Matched);

      if (recognition instanceof Matched)
        expect(recognition.value().toString()).toBe(char);
    });

    it('must match a letter already recognized by another rule', () => {
      const recognition = grammar.octet().derive(input('a'));

      expect(recognition).toBeInstanceOf(Matched);
    });

    it('must not match a character outside the byte range', () => {
      const recognition = grammar.octet().derive(input('😀'));

      expect(recognition).toBeInstanceOf(Unmatched);
    });
  });

  describe('sp', () => {
    it('must match a space', () => {
      const recognition = grammar.sp().derive(input(' '));

      expect(recognition).toBeInstanceOf(Matched);

      if (recognition instanceof Matched)
        expect(recognition.value().toString()).toBe(' ');
    });

    it('must not match a horizontal tab', () => {
      const recognition = grammar.sp().derive(input('\t'));

      expect(recognition).toBeInstanceOf(Unmatched);
    });
  });

  describe('vchar', () => {
    it.each(['!', '~'])("must match the boundary '%s'", char => {
      const recognition = grammar.vchar().derive(input(char));

      expect(recognition).toBeInstanceOf(Matched);

      if (recognition instanceof Matched)
        expect(recognition.value().toString()).toBe(char);
    });

    it.each(['a', '1'])(
      "must match '%s', already recognized by another rule",
      char => {
        const recognition = grammar.vchar().derive(input(char));

        expect(recognition).toBeInstanceOf(Matched);
      }
    );

    it('must not match a space', () => {
      const recognition = grammar.vchar().derive(input(' '));

      expect(recognition).toBeInstanceOf(Unmatched);
    });

    it('must not match DEL', () => {
      const recognition = grammar.vchar().derive(input('\x7f'));

      expect(recognition).toBeInstanceOf(Unmatched);
    });
  });

  describe('wsp', () => {
    it.each([' ', '\t'])("must match '%s'", char => {
      const recognition = grammar.wsp().derive(input(char));

      expect(recognition).toBeInstanceOf(Matched);

      if (recognition instanceof Matched)
        expect(recognition.value().toString()).toBe(char);
    });

    it('must not match a letter', () => {
      const recognition = grammar.wsp().derive(input('a'));

      expect(recognition).toBeInstanceOf(Unmatched);
    });
  });
});
