import { Terminal } from '@fundamentry/grammar';
import { Range, RangeSet } from '@fundamentry/range';
import { CodePoint } from '@fundamentry/scalar';

export class VCHAR extends Terminal {
  protected static override readonly domain = RangeSet.from([
    Range.closed(CodePoint.of(0x21), CodePoint.of(0x7e)),
  ]);
}
