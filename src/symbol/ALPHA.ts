import { Terminal } from '@fundamentry/grammar';
import { Range, RangeSet } from '@fundamentry/range';
import { CodePoint } from '@fundamentry/scalar';

export class ALPHA extends Terminal {
  protected static override readonly domain = RangeSet.from([
    Range.closed(CodePoint.of(0x41), CodePoint.of(0x5a)),
    Range.closed(CodePoint.of(0x61), CodePoint.of(0x7a)),
  ]);
}
