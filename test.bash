#!/bin/bash

WITHOUT_BABEL=$(mktemp)
WITH_BABEL=$(mktemp)
COMPILED=$(mktemp -p .)

node_modules/.bin/babel --plugins=. < input.js > ${COMPILED}
node ${COMPILED} > ${WITH_BABEL}
node input.js > ${WITHOUT_BABEL}

rm ${COMPILED}
if diff ${WITH_BABEL} ${WITHOUT_BABEL} ; then
  echo PASS
  exit 0
else
  echo FAIL
  exit 1
fi
