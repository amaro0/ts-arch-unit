import { Primitives, Token } from '../types';

export abstract class QueryBuilder {
  protected isNegated: boolean = false;

  that(): this {
    return this;
  }

  should(): this {
    return this;
  }

  not(): this {
    this.isNegated = !this.isNegated;

    return this;
  }

  protected eq<T extends Primitives>(a: T, b: T): boolean {
    if (this.isNegated) return a !== b;

    return a === b;
  }

  protected eqToken(name: string, token: Token): boolean {
    const isValid = typeof token === 'string' ? name === token : token.test(name);

    return this.isNegated ? !isValid : isValid;
  }
}