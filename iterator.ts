const identityFn = (value: any) => value;

export class NestedIterator<E, O> implements IterableIterator<O> {
  private subiterator: IterableIterator<E> | undefined;
  constructor(
    private readonly backingIterator: IterableIterator<E[]>,
    private readonly transformer: (entry: E) => O = identityFn
  ) {}

  [Symbol.iterator](): IterableIterator<O> {
    return this;
  }
  next(..._args: [] | [undefined]): IteratorResult<O, unknown> {
    while (this.backingIterator != null) {
      if (this.subiterator == null) {
        const result = this.backingIterator.next();
        if (result.done) {
          break;
        } else {
          this.subiterator = result.value.values();
        }
      } else {
        const result = this.subiterator.next();
        if (!result.done) {
          return { done: false, value: this.transformer(result.value) };
        } else {
          this.subiterator = undefined;
        }
      }
    }
    return { done: true, value: undefined };
  }
}
