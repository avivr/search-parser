# Search Parser

Allow parsing search queries, using free-text, keywords and boolean operators.

[![npm version](https://badge.fury.io/js/search-parser.svg)](https://badge.fury.io/js/search-parser)
[![Build Status](https://travis-ci.org/avivr/search-parser.svg?branch=master)](https://travis-ci.org/avivr/search-parser)
[![codecov](https://codecov.io/gh/avivr/search-parser/branch/master/graph/badge.svg)](https://codecov.io/gh/avivr/search-parser)

## Installation

Using yarn:

```shell
yarn add search-parser
```

Using npm: 
```shell 
npm instal search-parser --save
```

## Usage

```javascript
import { parse, parseToPredicate } from 'search-parser'
```

## API

### parse(query)
Convert a query string into an array of arrays of expression objects.
Support freetext, keywords (key:value), boolean operators (AND, OR, NOT) and parenthesis.
For more information on the shape of the nested arrays, read the documentation at [boolean-parser-js](https://github.com/riichard/boolean-parser-js).

Each expression object is in the form:
```javascript
{
  key: { condition: value }
}
```
Where ```key``` is the keyword or 'freetext' in case no given keyword.  
```condition``` is either 'include' or 'exclude' (when using NOT operator).  
And ```value``` is the term to search.

Sample test case:

```javascript
test('Parse expression with keywords, freetext and boolean operators', () => {
  const expected = [
    [{ "name": { "include": "aviv" } }, { "last": { "include": "rosental" } }],
    [{ "freetext": { "include": "any other contibuter" } }]
  ];
  expect(parse('name:aviv and last:rosental or any other contibuter')).toEqual(expected);
});
```

### parseToPredicate(query, searchFn)
Parse the query string and convert it into a unified predicate which represent the given query.
When executed on an ```item```, the predicate will call the given ```searchFn``` and pass it ```(item, textToSearch, keyword)```.

Sample test cases:

```javascript
  function search(item, textToSearch, keyword) {
    if (keyword === 'freetext') {
      return Object.values(item).map(value => value.toLowerCase()).some(value => value.toLowerCase().includes(textToSearch.toLowerCase())) 
    }
    return item && item[keyword.toLowerCase()] && item[keyword.toLowerCase()].toLowerCase().includes(textToSearch.toLowerCase());
  }

  const show = { name: 'iron-fist', year: '2017', rating: '7.6' };

  test('Text exists on object', () => {
    const predicate = parseToPredicate('fist', search);
    const result = predicate(show);
    expect(result).toBe(true);
  });

  test('Text does not exists on object', () => {
    const predicate = parseToPredicate('walking', search);
    const result = predicate(show);
    expect(result).toBe(false);
  });

  test('Match multiple fields on object using keywords', () => {
    const predicate = parseToPredicate('name:fist and year:2017', search);
    const result = predicate(show);
    expect(result).toBe(true);
  });

  test('Fail to match multiple fields on object using keywords', () => {
    const predicate = parseToPredicate('name:fist and year:2000', search);
    const result = predicate(show);
    expect(result).toBe(false);
  });
```

Using the predicate to filter collection:

```javascript
const shows = [ 
  { name: 'iron-fist', year: '2017', rating: '7.6' },
  { name: 'the walking dead', year: '2010', rating: '8.5' },
  { name: 'legion', year: '2017', rating: '8.8' },
  { name: 'game of thrones', year: '2011', rating: '9.5' } 
];

test('Search collection with keywords return multiple results', () => {
  const predicate = parseToPredicate('year:2017', search);
  const results = shows.filter(predicate);
  expect(results).toEqual([{ name: 'iron-fist', year: '2017', rating: '7.6' }, { name: 'legion', year: '2017', rating: '8.8' }]);
});
```

For more examples, see the [src/tests](src/tests) folder



## Notes
This library depends on [boolean-parser-js](https://github.com/riichard/boolean-parser-js) to parse the expressions using boolean operators (AND, OR).
