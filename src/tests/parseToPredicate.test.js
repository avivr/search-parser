import { parseToPredicate } from '..'

describe('#parseToPredicate: Create predicate to search in collection', () => {
 const shows = [ 
    { name: 'iron-fist', year: '2017', rating: '7.6' },
    { name: 'the walking dead', year: '2010', rating: '8.5' },
    { name: 'legion', year: '2017', rating: '8.8' },
    { name: 'game of thrones', year: '2011', rating: '9.5' } 
  ];

  function search(item, textToSearch, keyword) {
    if (keyword === 'freetext') {
      return Object.values(item).map(value => value.toLowerCase()).some(value => value.toLowerCase().includes(textToSearch.toLowerCase())) 
    }
    return item && item[keyword.toLowerCase()] && item[keyword.toLowerCase()].toLowerCase().includes(textToSearch.toLowerCase());
  }

  test('Search collection with freetext', () => {
    const predicate = parseToPredicate('fist', search);
    const results = shows.filter(predicate);
    expect(results).toEqual([{ name: 'iron-fist', year: '2017', rating: '7.6' }]);
  });

  test('Search collection on nonexisting value with freetext', () => {
    const predicate = parseToPredicate('sherlock', search);
    const results = shows.filter(predicate);
    expect(results).toEqual([]);
  });

  test('Search collection with keyword', () => {
    const predicate = parseToPredicate('name:fist', search);
    const results = shows.filter(predicate);
    expect(results).toEqual([{ name: 'iron-fist', year: '2017', rating: '7.6' }]);
  });

  test('Search collection on nonexisting value with keyword', () => {
    const predicate = parseToPredicate('name:sherlock', search);
    const results = shows.filter(predicate);
    expect(results).toEqual([]);
  });

  test('Search collection with keywords and boolean OR operator', () => {
    const predicate = parseToPredicate('name:fist or name:walking', search);
    const results = shows.filter(predicate);
    expect(results).toEqual([{ name: 'iron-fist', year: '2017', rating: '7.6' }, { name: 'the walking dead', year: '2010', rating: '8.5' }]);
  });

  test('Search collection with keywords and boolean AND operator', () => {
    const predicate = parseToPredicate('name:fist and year:2017', search);
    const results = shows.filter(predicate);
    expect(results).toEqual([{ name: 'iron-fist', year: '2017', rating: '7.6' }]);
  });

  test('Search collection with keywords return multiple results', () => {
    const predicate = parseToPredicate('year:2017', search);
    const results = shows.filter(predicate);
    expect(results).toEqual([{ name: 'iron-fist', year: '2017', rating: '7.6' }, { name: 'legion', year: '2017', rating: '8.8' }]);
  });

  test('Search collection with keywords and boolean AND, NOT operators', () => {
    const predicate = parseToPredicate('year:2017 and not name:legion', search);
    const results = shows.filter(predicate);
    expect(results).toEqual([{ name: 'iron-fist', year: '2017', rating: '7.6' }]);
  });

});

