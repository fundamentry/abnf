import { Symbol } from '@fundamentry/grammar';

import { HTAB } from './HTAB.js';
import { SP } from './SP.js';

export class WSP extends Symbol<SP | HTAB> {
  protected override isValid(element: SP | HTAB): boolean {
    return element instanceof SP || element instanceof HTAB;
  }
}
