import { type Repetition, Sequence, Symbol } from '@fundamentry/grammar';

import { CRLF } from './CRLF.js';
import { WSP } from './WSP.js';

export class LWSP extends Symbol<
  Repetition<WSP | Sequence<readonly [CRLF, WSP]>>
> {
  protected override isValid(
    repetition: Repetition<WSP | Sequence<readonly [CRLF, WSP]>>
  ): boolean {
    return repetition.elements().every(element => {
      if (element instanceof WSP) return true;

      if (!(element instanceof Sequence)) return false;

      const [crlf, wsp] = element.elements();

      return crlf instanceof CRLF && wsp instanceof WSP;
    });
  }
}
