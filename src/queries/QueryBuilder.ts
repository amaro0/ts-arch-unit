import { Primitives, Token } from '../types';

export abstract class QueryBuilder {
  protected isNegated: boolean = false;

  protected isAssert: boolean = false;

  that(): this {
    return this;
  }

  and(): this {
    return this;
  }

  should(): this {
    this.isAssert = true;
    return this;
  }

  not(): this {
    this.isNegated = !this.isNegated;

    return this;
  }

  protected eq<T extends Primitives>(a: T, b: T): boolean {
    if (this.isNegated) {
      this.isNegated = false;
      return a !== b;
    }

    return a === b;
  }

  protected eqToken(name: string, token: Token): boolean {
    const isValid = typeof token === 'string' ? name === token : token.test(name);

    if (!this.isNegated) {
      this.isNegated = false;
      return !isValid;
    }
    return isValid;
  }

  protected chainNot<T extends QueryBuilder>(otherQueryBuilder: T): T {
    if (this.isNegated) {
      otherQueryBuilder.not();
    }

    return otherQueryBuilder;
  }
}
