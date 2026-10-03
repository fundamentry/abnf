import { Codec, Production } from '@fundamentry/grammar';

import {
  ALPHA,
  BIT,
  CHAR,
  CR,
  CRLF,
  CTL,
  DIGIT,
  DQUOTE,
  HEXDIG,
  HTAB,
  LF,
  LWSP,
  OCTET,
  SP,
  VCHAR,
  WSP,
} from '#project/symbol';

export class Grammar {
  alpha(): Production<ALPHA> {
    return ALPHA.production();
  }

  bit(): Production<BIT> {
    return BIT.production();
  }

  char(): Production<CHAR> {
    return CHAR.production();
  }

  cr(): Production<CR> {
    return CR.production();
  }

  crlf(): Production<CRLF> {
    return Codec.tuple(this.cr(), this.lf()).refine(CRLF.prism());
  }

  ctl(): Production<CTL> {
    return CTL.production();
  }

  digit(): Production<DIGIT> {
    return DIGIT.production();
  }

  dquote(): Production<DQUOTE> {
    return DQUOTE.production();
  }

  hexdig(): Production<HEXDIG> {
    return this.digit()
      .or(Production.literal(HEXDIG.LETTERS))
      .refine(HEXDIG.prism());
  }

  htab(): Production<HTAB> {
    return HTAB.production();
  }

  lf(): Production<LF> {
    return LF.production();
  }

  lwsp(): Production<LWSP> {
    return this.wsp()
      .or(Codec.tuple(this.crlf(), this.wsp()))
      .many()
      .refine(LWSP.prism());
  }

  octet(): Production<OCTET> {
    return OCTET.production();
  }

  sp(): Production<SP> {
    return SP.production();
  }

  vchar(): Production<VCHAR> {
    return VCHAR.production();
  }

  wsp(): Production<WSP> {
    return this.sp().or(this.htab()).refine(WSP.prism());
  }
}
