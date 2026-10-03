import { Terminal } from '@fundamentry/grammar';
import { Range, RangeSet } from '@fundamentry/range';
import { CodePoint } from '@fundamentry/scalar';

export class SP extends Terminal {
  protected static override readonly domain = RangeSet.from([
    Range.singleton(CodePoint.of(0x20)),
  ]);
}
