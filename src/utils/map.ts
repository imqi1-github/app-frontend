export class BiMap<T, U> {
  private forward: Map<T, U>;
  private reverse: Map<U, T>;

  constructor() {
    this.forward = new Map<T, U>();
    this.reverse = new Map<U, T>();
  }

  set(forwardValue: T, reverseValue: U): void {
    // 先删除已有的映射，防止冲突
    if (this.forward.has(forwardValue)) this.reverse.delete(this.forward.get(forwardValue)!);
    if (this.reverse.has(reverseValue)) this.forward.delete(this.reverse.get(reverseValue)!);

    this.forward.set(forwardValue, reverseValue);
    this.reverse.set(reverseValue, forwardValue);
  }

  forwardGet(value: T): U | undefined {
    return this.forward.get(value);
  }

  reverseGet(value: U): T | undefined {
    return this.reverse.get(value);
  }

  forwardDelete(value: T): void {
    if (this.forward.has(value)) {
      const mappedValue = this.forward.get(value)!;
      this.forward.delete(value);
      this.reverse.delete(mappedValue);
    }
  }

  reverseDelete(value: U): void {
    if (this.reverse.has(value)) {
      const mappedValue = this.reverse.get(value)!;
      this.reverse.delete(value);
      this.forward.delete(mappedValue);
    }
  }
}
