import { Rule } from '@fundamentry/grammar';

export const alpha = new Rule('ALPHA', codec =>
  codec.character(['A', 'Z']).caseless()
);

export const bit = new Rule('BIT', codec =>
  codec.literal('0').or(codec.literal('1'))
);

export const char = new Rule('CHAR', codec => codec.character([0x01, 0x7f]));

export const cr = new Rule('CR', codec => codec.character(0x0d));

export const crlf = new Rule('CRLF', codec => codec.sequence(cr, lf));

export const ctl = new Rule('CTL', codec =>
  codec.character([0x00, 0x1f], 0x7f)
);

export const digit = new Rule('DIGIT', codec => codec.character(['0', '9']));

export const dquote = new Rule('DQUOTE', codec => codec.character(0x22));

export const hexdig = new Rule('HEXDIG', codec =>
  codec
    .choice(
      digit,
      codec.literal('A'),
      codec.literal('B'),
      codec.literal('C'),
      codec.literal('D'),
      codec.literal('E'),
      codec.literal('F')
    )
    .caseless()
);

export const htab = new Rule('HTAB', codec => codec.character(0x09));

export const lf = new Rule('LF', codec => codec.character(0x0a));

export const lwsp = new Rule('LWSP', codec =>
  wsp.or(codec.sequence(crlf, wsp)).many()
);

export const octet = new Rule('OCTET', codec => codec.character([0x00, 0xff]));

export const sp = new Rule('SP', codec => codec.character(0x20));

export const vchar = new Rule('VCHAR', codec => codec.character([0x21, 0x7e]));

export const wsp = new Rule('WSP', () => sp.or(htab));
