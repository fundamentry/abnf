import { Terminal } from '@fundamentry/grammar';
import { Range, RangeSet } from '@fundamentry/range';
import { CodePoint } from '@fundamentry/scalar';

export class OCTET extends Terminal {
  protected static override readonly domain = RangeSet.from([
    Range.closed(CodePoint.of(0x00), CodePoint.of(0xff)),
  ]);
}
