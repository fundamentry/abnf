import { Symbol, type Sequence } from '@fundamentry/grammar';

import { CR } from './CR.js';
import { LF } from './LF.js';

export class CRLF extends Symbol<Sequence<readonly [CR, LF]>> {
  protected override isValid(sequence: Sequence<readonly [CR, LF]>): boolean {
    const [cr, lf] = sequence.elements();

    return cr instanceof CR && lf instanceof LF;
  }
}
