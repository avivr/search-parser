# Search Parser

Allow parsing search queries, using free-text, keywords and boolean operators.

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
For more information on the shapre of the nested arrays, read the documentation at [boolean-parser-js](https://github.com/riichard/boolean-parser-js).

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



## Notes
This library depends on [boolean-parser-js](https://github.com/riichard/boolean-parser-js) to parse the expressions using boolean operators (AND, OR).
