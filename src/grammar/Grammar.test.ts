import { assert, describe, expect, it } from 'vitest';

import { CodePoint } from '@fundamentry/scalar';
import { Point } from '@fundamentry/stream';

import { WSP } from '#project/symbol';

import { Grammar } from './Grammar.js';

const input = (value: string) => Point.of(Array.from(value, CodePoint.of));

describe('Grammar', () => {
  const grammar = new Grammar();

  describe('alpha', () => {
    const rule = grammar.alpha();

    it.each(['a', 'z', 'A', 'Z'])("must match the letter '%s'", letter => {
      const result = rule.parse(input(letter));

      assert(result.ok());
      expect(result.value().value.toString()).toBe(letter);
      expect(result.value().rest.isAtEnd()).toBe(true);
    });

    it.each(['1', '@', '[', '`', '{'])("must not match '%s'", char => {
      expect(rule.parse(input(char)).ok()).toBe(false);
    });

    it('must not match the end of input', () => {
      expect(rule.parse(input('')).ok()).toBe(false);
    });

    it('must consume a single letter only', () => {
      const result = rule.parse(input('ab'));

      assert(result.ok());
      expect(result.value().value.toString()).toBe('a');
      expect(result.value().rest.isAtEnd()).toBe(false);
    });

    it('must print the code point it matched', () => {
      const result = rule.parse(input('a'));

      assert(result.ok());

      const printed = rule.print(result.value().value);

      assert(printed.ok());
      expect(printed.value().join('')).toBe('a');
    });
  });

  describe('bit', () => {
    const rule = grammar.bit();

    it.each(['0', '1'])("must match '%s'", bit => {
      const result = rule.parse(input(bit));

      assert(result.ok());
      expect(result.value().value.toString()).toBe(bit);
    });

    it('must not match a digit outside 0-1', () => {
      expect(rule.parse(input('5')).ok()).toBe(false);
    });
  });

  describe('char', () => {
    const rule = grammar.char();

    it.each(['\x01', '\x7f'])("must match the boundary '%s'", char => {
      const result = rule.parse(input(char));

      assert(result.ok());
      expect(result.value().value.toString()).toBe(char);
    });

    it('must match a letter already recognized by another rule', () => {
      expect(rule.parse(input('a')).ok()).toBe(true);
    });

    it.each(['\x00', '\x80'])("must not match '%s'", char => {
      expect(rule.parse(input(char)).ok()).toBe(false);
    });
  });

  describe('cr', () => {
    const rule = grammar.cr();

    it('must match a carriage return', () => {
      const result = rule.parse(input('\r'));

      assert(result.ok());
      expect(result.value().value.toString()).toBe('\r');
    });

    it('must not match a linefeed', () => {
      expect(rule.parse(input('\n')).ok()).toBe(false);
    });
  });

  describe('crlf', () => {
    const rule = grammar.crlf();

    it('must match a carriage return followed by a linefeed', () => {
      const result = rule.parse(input('\r\n'));

      assert(result.ok());
      expect(result.value().value.toString()).toBe('\r\n');
      expect(result.value().rest.isAtEnd()).toBe(true);
    });

    it('must not match a carriage return without a following linefeed', () => {
      expect(rule.parse(input('\r')).ok()).toBe(false);
    });

    it('must not match a linefeed followed by a carriage return', () => {
      expect(rule.parse(input('\n\r')).ok()).toBe(false);
    });

    it('must print the code points it matched', () => {
      const result = rule.parse(input('\r\n'));

      assert(result.ok());

      const printed = rule.print(result.value().value);

      assert(printed.ok());
      expect(printed.value().join('')).toBe('\r\n');
    });
  });

  describe('ctl', () => {
    const rule = grammar.ctl();

    it.each(['\x00', '\x1f', '\x7f'])("must match '%s'", char => {
      const result = rule.parse(input(char));

      assert(result.ok());
      expect(result.value().value.toString()).toBe(char);
    });

    it('must match a carriage return already recognized by another rule', () => {
      expect(rule.parse(input('\r')).ok()).toBe(true);
    });

    it.each([' ', '\x80'])("must not match '%s'", char => {
      expect(rule.parse(input(char)).ok()).toBe(false);
    });
  });

  describe('digit', () => {
    const rule = grammar.digit();

    it.each(['0', '9'])("must match the digit '%s'", digit => {
      const result = rule.parse(input(digit));

      assert(result.ok());
      expect(result.value().value.toString()).toBe(digit);
    });

    it.each(['/', ':', 'a'])("must not match '%s'", char => {
      expect(rule.parse(input(char)).ok()).toBe(false);
    });
  });

  describe('dquote', () => {
    const rule = grammar.dquote();

    it('must match a double quote', () => {
      const result = rule.parse(input('"'));

      assert(result.ok());
      expect(result.value().value.toString()).toBe('"');
    });

    it('must not match an apostrophe', () => {
      expect(rule.parse(input("'")).ok()).toBe(false);
    });
  });

  describe('hexdig', () => {
    const rule = grammar.hexdig();

    it.each(['0', '9', 'a', 'f', 'A', 'F'])("must match '%s'", char => {
      const result = rule.parse(input(char));

      assert(result.ok());
      expect(result.value().value.toString()).toBe(char);
    });

    it.each(['g', 'G', '@', '`'])("must not match '%s'", char => {
      expect(rule.parse(input(char)).ok()).toBe(false);
    });

    it.each(['7', 'a'])(
      "must print the code point it matched from '%s'",
      char => {
        const result = rule.parse(input(char));

        assert(result.ok());

        const printed = rule.print(result.value().value);

        assert(printed.ok());
        expect(printed.value().join('')).toBe(char);
      }
    );
  });

  describe('htab', () => {
    const rule = grammar.htab();

    it('must match a horizontal tab', () => {
      const result = rule.parse(input('\t'));

      assert(result.ok());
      expect(result.value().value.toString()).toBe('\t');
    });

    it('must not match a space', () => {
      expect(rule.parse(input(' ')).ok()).toBe(false);
    });
  });

  describe('lf', () => {
    const rule = grammar.lf();

    it('must match a linefeed', () => {
      const result = rule.parse(input('\n'));

      assert(result.ok());
      expect(result.value().value.toString()).toBe('\n');
    });

    it('must not match a carriage return', () => {
      expect(rule.parse(input('\r')).ok()).toBe(false);
    });
  });

  describe('lwsp', () => {
    const rule = grammar.lwsp();

    it.each([
      ['zero repetitions', ''],
      ['a single space', ' '],
      ['consecutive whitespace characters', ' \t'],
      ['a folded CRLF WSP sequence', '\r\n '],
      ['a space followed by a folded CRLF WSP sequence', ' \r\n\t'],
    ])('must match %s', (_, text) => {
      const result = rule.parse(input(text));

      assert(result.ok());
      expect(result.value().value.toString()).toBe(text);
      expect(result.value().rest.isAtEnd()).toBe(true);
    });

    it.each([
      ['input that does not start with whitespace', 'x', ''],
      ['a trailing CR that is not followed by an LF and WSP', ' \r', ' '],
      ['a trailing CRLF that is not followed by WSP', ' \r\n', ' '],
    ])('must stop before %s', (_, text, matched) => {
      const result = rule.parse(input(text));

      assert(result.ok());
      expect(result.value().value.toString()).toBe(matched);
      expect(result.value().rest.isAtEnd()).toBe(false);
    });

    it('must print the code points it matched', () => {
      const result = rule.parse(input(' \r\n\t'));

      assert(result.ok());

      const printed = rule.print(result.value().value);

      assert(printed.ok());
      expect(printed.value().join('')).toBe(' \r\n\t');
    });
  });

  describe('octet', () => {
    const rule = grammar.octet();

    it.each(['\x00', '\xff'])("must match '%s'", char => {
      const result = rule.parse(input(char));

      assert(result.ok());
      expect(result.value().value.toString()).toBe(char);
    });

    it('must match a letter already recognized by another rule', () => {
      expect(rule.parse(input('a')).ok()).toBe(true);
    });

    it.each(['Ā', '😀'])("must not match '%s'", char => {
      expect(rule.parse(input(char)).ok()).toBe(false);
    });
  });

  describe('sp', () => {
    const rule = grammar.sp();

    it('must match a space', () => {
      const result = rule.parse(input(' '));

      assert(result.ok());
      expect(result.value().value.toString()).toBe(' ');
    });

    it('must not match a horizontal tab', () => {
      expect(rule.parse(input('\t')).ok()).toBe(false);
    });
  });

  describe('vchar', () => {
    const rule = grammar.vchar();

    it.each(['!', '~'])("must match the boundary '%s'", char => {
      const result = rule.parse(input(char));

      assert(result.ok());
      expect(result.value().value.toString()).toBe(char);
    });

    it.each(['a', '1'])(
      "must match '%s', already recognized by another rule",
      char => {
        expect(rule.parse(input(char)).ok()).toBe(true);
      }
    );

    it.each([' ', '\x7f'])("must not match '%s'", char => {
      expect(rule.parse(input(char)).ok()).toBe(false);
    });
  });

  describe('wsp', () => {
    const rule = grammar.wsp();

    it.each([' ', '\t'])("must match '%s'", char => {
      const result = rule.parse(input(char));

      assert(result.ok());
      expect(result.value().value).toBeInstanceOf(WSP);
      expect(result.value().value.toString()).toBe(char);
    });

    it('must not match a letter', () => {
      expect(rule.parse(input('a')).ok()).toBe(false);
    });

    it.each([' ', '\t'])(
      "must print the code point it matched from '%s'",
      char => {
        const result = rule.parse(input(char));

        assert(result.ok());

        const printed = rule.print(result.value().value);

        assert(printed.ok());
        expect(printed.value().join('')).toBe(char);
      }
    );
  });
});
