import { describe, expect, test } from '@jest/globals';
import { ObjectSet } from './set';

interface Foo {
  thing: string;
  stuff?: number;
}

describe('.add()', () => {
  test('stores unique values', () => {
    const set = new ObjectSet<Foo>();

    set.add({ thing: 'hi' });
    set.add({ thing: 'hi', stuff: 0 });

    expect(set.size).toBe(2);
  });


  test('ignores duplicate values', () => {
    const set = new ObjectSet<Foo>();

    set.add({ thing: 'hi' });
    set.add({ thing: 'hi' });

    expect(set.size).toBe(1);
  });
});

describe('.has()', () => {
  test('finds equivalent values', () => {
    const set = new ObjectSet<Foo>();

    set.add({ thing: 'hi' });

    expect(set.has({ thing: 'hi' })).toBe(true);
  });

  test('does not find differing values', () => {
    const set = new ObjectSet<Foo>();

    set.add({ thing: 'hi' });

    expect(set.has({ thing: 'hi' })).toBe(true);
  });
});

// const set = new ObjectSet<Foo>();
// set.add(baseFoo);
// assertEquals(set.size, 1, 'size');
// set.add(baseFoo);
// assertEquals(set.size, 1, 'size');
// set.add({thing: 'hi', stuff: 0});
// assertEquals(set.size, 2, 'size');
// set.add({thing: 'hi', stuff: 1});
// assertEquals(set.size, 3, 'size');

// assertEquals(set.has(baseFoo), true, 'hasFoo');
// let deleted = set.delete(baseFoo);
// assertEquals(deleted, true, 'deleted');
// assertEquals(set.size, 2, 'size');
// assertEquals(set.has(baseFoo), false, 'hasFoo');

// console.log(set.toJSON());

// function assertEquals(actual: unknown, expected: unknown, value?: string) {
//   console.assert(actual === expected, JSON.stringify({value, expected, actual}));
// }
