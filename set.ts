import { areEqual } from './equality';
import { toHashCode } from './hash';
import { NestedIterator } from './iterator';

export class ObjectSet<T> implements Set<T> {
  private readonly hashMap = new Map<number, T[]>();
  private trueSize = 0;

  add(value: T): this {
    const hashCode = toHashCode(value);
    const nodes = this.hashMap.get(hashCode) ?? [];
    for (const node of nodes) {
      if (areEqual(value, node)) {
        return this;
      }
    }
    this.trueSize++;
    nodes.push(value);
    this.hashMap.set(hashCode, nodes);
    return this;
  }

  clear(): void {
    this.trueSize = 0;
    this.hashMap.clear();
  }

  delete(value: T): boolean {
    const hashCode = toHashCode(value);
    const nodes = this.hashMap.get(hashCode) ?? [];
    for (let i = 0; i < nodes.length; i++) {
      if (areEqual(value, nodes[i])) {
        nodes.splice(i, 1);
        this.hashMap.set(hashCode, nodes);
        this.trueSize--;
        return true;
      }
    }
    return false;
  }

  forEach(
    callbackfn: (value: T, value2: T, set: ObjectSet<T>) => void,
    thisArg?: unknown
  ): void {
    for (const hashGroup of this.hashMap.values()) {
      for (const node of hashGroup) {
        callbackfn.call(thisArg ?? this, node, node, this);
      }
    }
  }

  has(value: T): boolean {
    const hashCode = toHashCode(value);
    const nodes = this.hashMap.get(hashCode) ?? [];
    for (const node of nodes) {
      if (areEqual(value, node)) {
        return true;
      }
    }
    return false;
  }

  get size(): number {
    return this.trueSize;
  }

  entries(): IterableIterator<[T, T]> {
    return new NestedIterator(this.hashMap.values(), (entry) => [entry, entry]);
  }

  keys(): IterableIterator<T> {
    return new NestedIterator(this.hashMap.values());
  }

  values(): IterableIterator<T> {
    return new NestedIterator(this.hashMap.values());
  }

  [Symbol.iterator](): IterableIterator<T> {
    return this.values();
  }

  toString(): string {
    return JSON.stringify(this);
  }

  toJSON(): unknown {
    const arrayCopy = [];
    for (const value of this.values()) {
      arrayCopy.push(value);
    }
    return arrayCopy;
  }

  readonly [Symbol.toStringTag]: string = 'ObjectSet';
}
