import { Rule } from '@fundamentry/grammar';
import { Range, RangeSet } from '@fundamentry/range';
import { CodePoint } from '@fundamentry/scalar';

export class Grammar {
  terminal(...ranges: readonly Range<CodePoint>[]): Rule<CodePoint> {
    const set = RangeSet.from(ranges);

    return Rule.matching(candidate => candidate instanceof CodePoint).filter(
      value => set.contains(value)
    );
  }

  alpha(): Rule<CodePoint> {
    return this.terminal(
      Range.closed(CodePoint.of(0x41), CodePoint.of(0x5a)),
      Range.closed(CodePoint.of(0x61), CodePoint.of(0x7a))
    );
  }

  bit(): Rule<CodePoint> {
    return this.terminal(Range.closed(CodePoint.of(0x30), CodePoint.of(0x31)));
  }

  char(): Rule<CodePoint> {
    return this.terminal(Range.closed(CodePoint.of(0x01), CodePoint.of(0x7f)));
  }

  cr(): Rule<CodePoint> {
    return this.terminal(Range.singleton(CodePoint.of(0x0d)));
  }

  crlf(): Rule<string> {
    return Rule.sequence(this.cr(), this.lf()).map(
      ([cr, lf]) => cr.toString() + lf.toString()
    );
  }

  ctl(): Rule<CodePoint> {
    return this.terminal(
      Range.closed(CodePoint.of(0x00), CodePoint.of(0x1f)),
      Range.singleton(CodePoint.of(0x7f))
    );
  }

  digit(): Rule<CodePoint> {
    return this.terminal(Range.closed(CodePoint.of(0x30), CodePoint.of(0x39)));
  }

  dquote(): Rule<CodePoint> {
    return this.terminal(Range.singleton(CodePoint.of(0x22)));
  }

  hexdig(): Rule<CodePoint> {
    return this.digit().or(
      this.terminal(
        Range.closed(CodePoint.of(0x41), CodePoint.of(0x46)),
        Range.closed(CodePoint.of(0x61), CodePoint.of(0x66))
      )
    );
  }

  htab(): Rule<CodePoint> {
    return this.terminal(Range.singleton(CodePoint.of(0x09)));
  }

  lf(): Rule<CodePoint> {
    return this.terminal(Range.singleton(CodePoint.of(0x0a)));
  }

  lwsp(): Rule<string> {
    return Rule.sequence(this.crlf().optional(), this.wsp())
      .map(([crlf = '', wsp]) => crlf + wsp.toString())
      .many()
      .map(parts => parts.join(''));
  }

  octet(): Rule<CodePoint> {
    return this.terminal(Range.closed(CodePoint.of(0x00), CodePoint.of(0xff)));
  }

  sp(): Rule<CodePoint> {
    return this.terminal(Range.singleton(CodePoint.of(0x20)));
  }

  vchar(): Rule<CodePoint> {
    return this.terminal(Range.closed(CodePoint.of(0x21), CodePoint.of(0x7e)));
  }

  wsp(): Rule<CodePoint> {
    return this.sp().or(this.htab());
  }
}
