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

  var filterObjects = parsedBooleanQuery.map(toFilterObject);
  return filterObjects;
}
