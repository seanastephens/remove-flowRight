const _ = require('lodash');

module.exports = function(babel) {

  const {
    identifier,
    isIdentifier,
    restElement,
    spreadElement,
    callExpression,
    isCallExpression,
    arrowFunctionExpression,
    isArrayExpression
  } = babel.types;

  const identity = arrowFunctionExpression(
    [identifier('x')],
    identifier('x')
  );

  return {
    visitor: {
      CallExpression(path) {

        if(path.node.callee.name !== 'flowRight') {
          return;
        }

        const flowArgs = path.node.arguments;
        const arrayForm = flowArgs.length === 1 && isArrayExpression(flowArgs[0]);
        const fs = arrayForm ? flowArgs[0].elements : flowArgs;

        if(fs.length === 0) {
          path.replaceWith(identity);
          return;
        }

        if(!arrayForm && fs.length === 1 && !isIdentifier(fs[0])) {
          return;
        }

        if(fs.length === 1) {
          path.replaceWith(fs[0]);
          return;
        }

        const nonIdentifier = _.reject(fs, isIdentifier);

        if(!_.every(nonIdentifier, isCallExpression)) return;

        const body = fs.reverse().reduce((inner, next) => {
          const callee = isIdentifier(next) ? next : next.callee;
          return callExpression(callee, [inner]);
        }, spreadElement(identifier('args')));

        const innerFunction = arrowFunctionExpression([restElement(identifier('args'))], body);

        const finalFunction = (nonIdentifier.length > 0)
          ? callExpression(arrowFunctionExpression(nonIdentifier.map(x => x.callee), innerFunction), nonIdentifier)
          : innerFunction;

        path.replaceWith(finalFunction);

      }
    }
  };
}
