const get = require('lodash.get');
const set = require('lodash.set');
const booleanParser = require('boolean-parser');

export function parse(query) {
  const parsedBooleanQuery = booleanParser.parseBooleanQuery(query.toUpperCase());

  function toFilterObject(expressions) {
    return expressions
      .map(expr => {
        const collectionName = expr.startsWith('NOT') ? 'exclude' : 'include';
        const positiveExpr = expr.replace(/^NOT /, "").toLowerCase();
        const { key, value } = positiveExpr.indexOf(':') > -1 ?
          { key: positiveExpr.split(':')[0], value: positiveExpr.split(':')[1] } :
          { key: 'freetext', value: positiveExpr };

        return {
          [key]: {
            [collectionName]: value
          }
        };
      });
  }

  return parsedBooleanQuery.map(toFilterObject);
}

function createPredicateExpression(queryExpr, check) {
  const key = Object.keys(queryExpr)[0];
  const value = queryExpr[key];
  const condition = o => !!(value.include && check(o, value.include, key) || value.exclude && !check(o, value.exclude, key));
  return condition;
}

function createPredicate(queryExpr, check) {
  const createExpression = expression => createPredicateExpression(expression, check);
  const andExpr = (a, b) => o => a(o) && b(o);
  const orExpr = (a, b) => o => a(o) || b(o);
  const defaultAnd = () => true;
  const defaultOr = () => false;
  const combineAndExpressions = expr => expr.map(createExpression).reduce(andExpr, defaultAnd)
  return queryExpr.map(combineAndExpressions).reduce(orExpr, defaultOr);
}

export function parseToPredicate(query, check) {
  return createPredicate(parse(query), check);
}