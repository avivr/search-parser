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


## Notes
This library depends on [boolean-parser-js](https://github.com/riichard/boolean-parser-js) to parse the expressions using boolean operators (AND, OR).
