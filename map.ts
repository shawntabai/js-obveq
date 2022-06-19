import { areEqual } from './equality';
import { toHashCode } from './hash';
import { NestedIterator } from './iterator';

export class ObjectMap<K, V> implements Map<K, V> {
  private readonly hashMap = new Map<number, [K, V][]>();
  private trueSize = 0;

  set(key: K, value: V): this {
    const hashCode = toHashCode(key);
    const nodes = this.hashMap.get(hashCode) ?? [];
    for (let i = 0; i < nodes.length; i++) {
      const [nodeKey, _nodeValue] = nodes[i];
      if (areEqual(key, nodeKey)) {
        nodes[i] = [key, value];
        this.hashMap.set(hashCode, nodes);
        return this;
      }
    }
    this.trueSize++;
    nodes.push([key, value]);
    this.hashMap.set(hashCode, nodes);
    return this;
  }

  get(key: K): V | undefined {
    const hashCode = toHashCode(key);
    const nodes = this.hashMap.get(hashCode) ?? [];
    for (const [nodeKey, nodeValue] of nodes) {
      if (areEqual(key, nodeKey)) {
        return nodeValue;
      }
    }
    return undefined;
  }

  clear(): void {
    this.trueSize = 0;
    this.hashMap.clear();
  }

  delete(key: K): boolean {
    const hashCode = toHashCode(key);
    const nodes = this.hashMap.get(hashCode) ?? [];
    for (let i = 0; i < nodes.length; i++) {
      const [nodeKey, _nodeValue] = nodes[i];
      if (areEqual(key, nodeKey)) {
        nodes.splice(i, 1);
        this.hashMap.set(hashCode, nodes);
        this.trueSize--;
        return true;
      }
    }
    return false;
  }

  forEach(
    callbackfn: (value: V, key: K, map: Map<K, V>) => void,
    thisArg?: unknown
  ): void {
    for (const hashGroup of this.hashMap.values()) {
      for (const [nodeKey, nodeValue] of hashGroup) {
        callbackfn.call(thisArg ?? this, nodeValue, nodeKey, this);
      }
    }
  }

  has(key: K): boolean {
    const hashCode = toHashCode(key);
    const nodes = this.hashMap.get(hashCode) ?? [];
    for (const [nodeKey, nodeValue] of nodes) {
      if (areEqual(key, nodeKey)) {
        return true;
      }
    }
    return false;
  }

  get size(): number {
    return this.trueSize;
  }

  entries(): IterableIterator<[K, V]> {
    return new NestedIterator(this.hashMap.values());
  }

  keys(): IterableIterator<K> {
    return new NestedIterator(this.hashMap.values(), (e) => e[0]);
  }

  values(): IterableIterator<V> {
    return new NestedIterator(this.hashMap.values(), (e) => e[1]);
  }

  [Symbol.iterator](): IterableIterator<[K, V]> {
    return this.entries();
  }

  toString(): string {
    return JSON.stringify(this);
  }

  toJSON(): unknown {
    const arrayCopy = [];
    for (const value of this.entries()) {
      arrayCopy.push(value);
    }
    return arrayCopy;
  }

  readonly [Symbol.toStringTag]: string = 'ObjectMap';
}
