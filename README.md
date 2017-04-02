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
test('Parse freetext expression with multiple boolean operators and parenthesis', () => {
    const expected = [
      [{ "freetext": { "include": "query expression" } }, { "freetext": { "include": "another expression" } }, { "freetext": { "exclude": "last expression" } }],
      [{ "freetext": { "include": "third expression" } }, { "freetext": { "exclude": "last expression" } }]
    ];
    expect(parse('(query expression and another expression or third expression) and not last expression')).toEqual(expected);
  });
```



## Notes
This library depends on [boolean-parser-js](https://github.com/riichard/boolean-parser-js) to parse the expressions using boolean operators (AND, OR).
