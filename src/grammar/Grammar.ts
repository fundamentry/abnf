import { Rule } from '@fundamentry/grammar';
import { Range, RangeSet } from '@fundamentry/range';
import { Scalar, codePoint } from '@fundamentry/scalar';

export class Grammar {
  terminal(
    ...ranges: readonly Range<Scalar.CodePoint>[]
  ): Rule<Scalar.CodePoint> {
    const set = RangeSet.from(ranges);

    return Rule.matching(
      candidate => candidate instanceof Scalar.CodePoint
    ).filter(value => set.contains(value));
  }

  alpha(): Rule<Scalar.CodePoint> {
    return this.terminal(
      Range.closed(codePoint(0x41), codePoint(0x5a)),
      Range.closed(codePoint(0x61), codePoint(0x7a))
    );
  }

  bit(): Rule<Scalar.CodePoint> {
    return this.terminal(Range.closed(codePoint(0x30), codePoint(0x31)));
  }

  char(): Rule<Scalar.CodePoint> {
    return this.terminal(Range.closed(codePoint(0x01), codePoint(0x7f)));
  }

  cr(): Rule<Scalar.CodePoint> {
    return this.terminal(Range.singleton(codePoint(0x0d)));
  }

  crlf(): Rule<string> {
    return Rule.sequence(this.cr(), this.lf()).map(
      ([cr, lf]) => cr.toString() + lf.toString()
    );
  }

  ctl(): Rule<Scalar.CodePoint> {
    return this.terminal(
      Range.closed(codePoint(0x00), codePoint(0x1f)),
      Range.singleton(codePoint(0x7f))
    );
  }

  digit(): Rule<Scalar.CodePoint> {
    return this.terminal(Range.closed(codePoint(0x30), codePoint(0x39)));
  }

  dquote(): Rule<Scalar.CodePoint> {
    return this.terminal(Range.singleton(codePoint(0x22)));
  }

  hexdig(): Rule<Scalar.CodePoint> {
    return this.digit().or(
      this.terminal(
        Range.closed(codePoint(0x41), codePoint(0x46)),
        Range.closed(codePoint(0x61), codePoint(0x66))
      )
    );
  }

  htab(): Rule<Scalar.CodePoint> {
    return this.terminal(Range.singleton(codePoint(0x09)));
  }

  lf(): Rule<Scalar.CodePoint> {
    return this.terminal(Range.singleton(codePoint(0x0a)));
  }

  lwsp(): Rule<string> {
    return Rule.sequence(this.crlf().optional(), this.wsp())
      .map(([crlf = '', wsp]) => crlf + wsp.toString())
      .many()
      .map(parts => parts.join(''));
  }

  octet(): Rule<Scalar.CodePoint> {
    return this.terminal(Range.closed(codePoint(0x00), codePoint(0xff)));
  }

  sp(): Rule<Scalar.CodePoint> {
    return this.terminal(Range.singleton(codePoint(0x20)));
  }

  vchar(): Rule<Scalar.CodePoint> {
    return this.terminal(Range.closed(codePoint(0x21), codePoint(0x7e)));
  }

  wsp(): Rule<Scalar.CodePoint> {
    return this.sp().or(this.htab());
  }
}
