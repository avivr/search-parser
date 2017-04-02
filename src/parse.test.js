import { parse } from '.'

describe('#parse: Parse query expression to arrays', () => {

  test('Parse simple freetext query', () => {
    const expected = [
      [{ "freetext": { "include": "query expression" } }]
    ];
    expect(parse('query expression')).toEqual(expected);
  });

  test('Parse freetext expression with NOT boolean operator', () => {
    const expected = [
      [{ "freetext": { "exclude": "query expression" } }]
    ];
    expect(parse('not query expression')).toEqual(expected);
  });

  test('Parse freetext expression with OR boolean operator', () => {
    const expected = [
      [{ "freetext": { "include": "query expression" } }],
      [{ "freetext": { "include": "another expression" } }],
    ];
    expect(parse('query expression or another expression')).toEqual(expected);
  });

  test('Parse freetext expression with AND boolean operator', () => {
    const expected = [
      [{ "freetext": { "include": "query expression" } },
      { "freetext": { "include": "another expression" } }]
    ];
    expect(parse('query expression and another expression')).toEqual(expected);
  });

  test('Parse freetext expression with multiple boolean operators', () => {
    const expected = [
      [{ "freetext": { "include": "query expression" } }, { "freetext": { "include": "another expression" } }],
      [{ "freetext": { "include": "third expression" } }, { "freetext": { "exclude": "last expression" } }]
    ];
    expect(parse('query expression and another expression or third expression and not last expression')).toEqual(expected);
  });

  test('Parse freetext expression with multiple boolean operators and parenthesis', () => {
    const expected = [
      [{ "freetext": { "include": "query expression" } }, { "freetext": { "include": "another expression" } }, { "freetext": { "exclude": "last expression" } }],
      [{ "freetext": { "include": "third expression" } }, { "freetext": { "exclude": "last expression" } }]
    ];
    expect(parse('(query expression and another expression or third expression) and not last expression')).toEqual(expected);
  });

  test('Parse expression with keywords', () => {
    const expected = [
      [{ "name": { "include": "aviv" } }, { "last": { "include": "rosental" } }]
    ];
    expect(parse('name:aviv and last:rosental')).toEqual(expected);
  });

  test('Parse expression with keywords, freetext and boolean operators', () => {
    const expected = [
      [{ "name": { "include": "aviv" } }, { "last": { "include": "rosental" } }],
      [{ "freetext": { "include": "any other contibuter" } }]
    ];
    expect(parse('name:aviv and last:rosental or any other contibuter')).toEqual(expected);
  });

});

