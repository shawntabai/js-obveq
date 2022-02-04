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

describe('.delete()', () => {
  test('removes equivalent values', () => {
    const set = new ObjectSet<Foo>();

    set.add({ thing: 'hi' });
    const deleted = set.delete({ thing: 'hi' });

    expect(deleted).toBe(true);
    expect(set.size).toBe(0);
  });

  test('does not find differing values', () => {
    const set = new ObjectSet<Foo>();

    set.add({ thing: 'hi' });
    const deleted = set.delete({ thing: 'bye' });

    expect(deleted).toBe(false);
    expect(set.size).toBe(1);
    expect(set.has({ thing: 'hi' })).toBe(true);
  });
});

describe('JSON.stringify()', () => {
  test('creates accurate output', () => {
    const set = new ObjectSet<Foo>();

    set.add({ thing: 'hi' });
    set.add({ thing: 'hello', stuff: 18 });
    set.add({ thing: 'bye' });

    expect(JSON.stringify(set)).toBe(
      '[{"thing":"hi"},{"thing":"hello","stuff":18},{"thing":"bye"}]');
  });
});
