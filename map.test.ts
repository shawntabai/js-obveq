import { describe, expect, test } from '@jest/globals';
import { ObjectMap } from './map';

interface Foo {
  thing: string;
  stuff?: number;
}
interface Bar {
  type: 'baz' | 'qux';
}

describe('.add()', () => {
  test('stores separate values for unique keys', () => {
    const map = new ObjectMap<Foo, Bar>();

    map.set({ thing: 'hi' }, { type: 'baz' });
    map.set({ thing: 'hi', stuff: 0 }, { type: 'qux' });

    expect(map.size).toEqual(2);
  });

  test('overwrites values for duplicate keys', () => {
    const map = new ObjectMap<Foo, Bar>();

    map.set({ thing: 'hi' }, { type: 'baz' });
    map.set({ thing: 'hi' }, { type: 'qux' });

    expect(map.size).toEqual(1);
    expect(map.get({ thing: 'hi' })?.type).toEqual('qux');
  });

  test('handles large maps', () => {
    const map = new ObjectMap<Foo, Bar>();

    for (let i = 0; i < 500000; i++) {
      map.set({ thing: `hi ${i}` }, { type: 'baz' });
    }

    expect(map.size).toEqual(500000);
  });
  test('handles large maps natively', () => {
    const map = new Map<string, string>();

    for (let i = 0; i < 500000; i++) {
      map.set(`hi ${i}`, 'baz');
    }

    expect(map.size).toEqual(500000);
  });
});

describe('.has()', () => {
  test('finds equivalent keys', () => {
    const map = new ObjectMap<Foo, Bar>();

    map.set({ thing: 'hi' }, { type: 'baz' });

    expect(map.has({ thing: 'hi' })).toBeTruthy();
  });

  test('does not find differing keys', () => {
    const map = new ObjectMap<Foo, Bar>();

    map.set({ thing: 'hi' }, { type: 'baz' });

    expect(map.has({ thing: 'bye' })).toBeFalsy();
  });
});

describe('.delete()', () => {
  test('removes equivalent keys', () => {
    const map = new ObjectMap<Foo, Bar>();

    map.set({ thing: 'hi' }, { type: 'baz' });
    const deleted = map.delete({ thing: 'hi' });

    expect(deleted).toBeTruthy();
    expect(map.size).toEqual(0);
  });

  test('does not remove differing keys', () => {
    const map = new ObjectMap<Foo, Bar>();

    map.set({ thing: 'hi' }, { type: 'baz' });
    const deleted = map.delete({ thing: 'bye' });

    expect(deleted).toBeFalsy();
    expect(map.size).toEqual(1);
    expect(map.has({ thing: 'hi' })).toBeTruthy();
  });
});

describe('JSON.stringify()', () => {
  test('creates accurate output', () => {
    const map = new ObjectMap<Foo, Bar>();

    map.set({ thing: 'hi' }, { type: 'baz' });
    map.set({ thing: 'hello', stuff: 18 }, { type: 'qux' });
    map.set({ thing: 'bye' }, { type: 'baz' });
    const json = JSON.stringify(map);
    const rebuild = JSON.parse(json);

    expect(rebuild).toEqual(
      expect.arrayContaining([
        [{ thing: 'hi' }, { type: 'baz' }],
        [{ thing: 'hello', stuff: 18 }, { type: 'qux' }],
        [{ thing: 'bye' }, { type: 'baz' }],
      ])
    );
  });
});
