/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ValueObject } from "./ValueObject";

export class ValueObjectMap<K extends ValueObject<any>, V>
  implements Map<K, V> {
  private readonly map: Map<K, V>;

  constructor(tuples?: [K, V][]) {
    this.map = new Map<K, V>(tuples);
  }

  private getKeyRef(key: K): K | undefined {
    // eslint-disable-next-line no-restricted-syntax
    for (const i of this.map.keys()) {
      if (i.equals(key)) {
        return i;
      }
    }
    return undefined;
  }

  clear(): void {
    this.map.clear();
  }

  delete(key: K): boolean {
    const keyRef = this.getKeyRef(key);
    if (!keyRef) {
      return false;
    }
    return this.delete(keyRef);
  }

  forEach(
    callbackfn: (value: V, key: K, map: Map<K, V>) => void,
    thisArg?: any
  ): void {
    this.map.forEach(callbackfn, thisArg);
  }

  get(key: K): V | undefined {
    const keyRef = this.getKeyRef(key);
    if (!keyRef) {
      return undefined;
    }
    return this.map.get(keyRef);
  }

  has(key: K): boolean {
    const keyRef = this.getKeyRef(key);
    if (!keyRef) {
      return false;
    }
    return this.map.has(keyRef);
  }

  set(key: K, value: V): this {
    this.map.set(key, value);
    return this;
  }

  get size(): number {
    return this.map.size;
  }

  [Symbol.iterator](): IterableIterator<[K, V]> {
    return this.map[Symbol.iterator]();
  }

  entries(): IterableIterator<[K, V]> {
    return this.map.entries();
  }

  keys(): IterableIterator<K> {
    return this.map.keys();
  }

  values(): IterableIterator<V> {
    return this.map.values();
  }

  get [Symbol.toStringTag](): string {
    return this.map[Symbol.toStringTag];
  }
}
