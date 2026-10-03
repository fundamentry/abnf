import { Literal, Symbol } from '@fundamentry/grammar';
import { Range, RangeSet } from '@fundamentry/range';
import { CodePoint } from '@fundamentry/scalar';

import { DIGIT } from './DIGIT.js';

export class HEXDIG extends Symbol<DIGIT | Literal> {
  static readonly LETTERS = RangeSet.from([
    Range.closed(CodePoint.of(0x41), CodePoint.of(0x46)),
    Range.closed(CodePoint.of(0x61), CodePoint.of(0x66)),
  ]);

  protected override isValid(element: DIGIT | Literal): boolean {
    return (
      element instanceof DIGIT ||
      (element instanceof Literal &&
        HEXDIG.LETTERS.contains(element.codePoint()))
    );
  }
}
