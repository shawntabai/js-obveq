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

    expect(set.size).toEqual(2);
  });

  test('ignores duplicate values', () => {
    const set = new ObjectSet<Foo>();

    set.add({ thing: 'hi' });
    set.add({ thing: 'hi' });

    expect(set.size).toEqual(1);
  });

  test('handles large sets', () => {
    const set = new ObjectSet<Foo>();

    for (let i = 0; i < 500000; i++) {
      set.add({ thing: `hi ${i}` });
    }

    expect(set.size).toEqual(500000);
  });
  test('handles large sets natively', () => {
    const set = new Set<string>();

    for (let i = 0; i < 500000; i++) {
      set.add(`hi ${i}`);
    }

    expect(set.size).toEqual(500000);
  });
});

describe('.has()', () => {
  test('finds equivalent values', () => {
    const set = new ObjectSet<Foo>();

    set.add({ thing: 'hi' });

    expect(set.has({ thing: 'hi' })).toBeTruthy();
  });

  test('does not find differing values', () => {
    const set = new ObjectSet<Foo>();

    set.add({ thing: 'hi' });

    expect(set.has({ thing: 'bye' })).toBeFalsy();
  });
});

describe('.delete()', () => {
  test('removes equivalent values', () => {
    const set = new ObjectSet<Foo>();

    set.add({ thing: 'hi' });
    const deleted = set.delete({ thing: 'hi' });

    expect(deleted).toBeTruthy();
    expect(set.size).toEqual(0);
  });

  test('does not remove differing values', () => {
    const set = new ObjectSet<Foo>();

    set.add({ thing: 'hi' });
    const deleted = set.delete({ thing: 'bye' });

    expect(deleted).toBeFalsy();
    expect(set.size).toEqual(1);
    expect(set.has({ thing: 'hi' })).toBeTruthy();
  });
});

describe('JSON.stringify()', () => {
  test('creates accurate output', () => {
    const set = new ObjectSet<Foo>();

    set.add({ thing: 'hi' });
    set.add({ thing: 'hello', stuff: 18 });
    set.add({ thing: 'bye' });
    const json = JSON.stringify(set);
    const rebuild = JSON.parse(json);

    expect(rebuild).toEqual(
      expect.arrayContaining([
        { thing: 'hi' },
        { thing: 'hello', stuff: 18 },
        { thing: 'bye' },
      ])
    );
  });
});
