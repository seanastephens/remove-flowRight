const { flowRight } = require('lodash');

const f = x => x + 1;
const g = x => x * x;
const h = x => Math.pow(2, x);

const s = function() { return x => 's' + Array.from(arguments).join(x); }
const t = s;
const q = s;

const sapp = s('lol');


// Simple cases
[
  flowRight(),
  flowRight(f),
  flowRight(f, g),
  flowRight(f, g, h),

  flowRight([]),
  flowRight([f]),
  flowRight([f, g]),
  flowRight([f, g, h])
].forEach(f => console.log(f(1), f(2), f(3)));

// Bailing when we can't be sure it is safe
[
  flowRight(sapp),
  flowRight([sapp]),
  flowRight(s()),
  flowRight(s('a')),
  flowRight([s('a')]),
  flowRight(s('a'), t),
  flowRight([sapp].map(x => x)),
  flowRight(s('a'), t('b', 'c')),
  flowRight([s('a'), t('b', 'c')]),
].forEach(f => console.log(f(',')));


// Why not
[
  flowRight( s(), flowRight( t(), q('a'))),
  flowRight( flowRight( flowRight( s('a', 'b') ) ) )
].forEach(f => console.log(f(',')));
