import path from 'path';
import { Primitives, Token } from '../types';

export abstract class QueryBuilder {
  protected isNegated: boolean = false;

  protected isAssert: boolean = false;

  /**
   * Utility method used for elegant chaining.
   */
  that(): this {
    return this;
  }

  /**
   * Utility method used for elegant chaining.
   */
  and(): this {
    return this;
  }

  /**
   * Utility method used for elegant chaining.
   */
  are(): this {
    return this;
  }

  /**
   * Utility method used for elegant chaining.
   */
  be(): this {
    return this;
  }

  /**
   * Switches query to assert mode.
   */
  should(): this {
    this.isAssert = true;
    return this;
  }

  /**
   * Negates next filter or async query method. Works only for single method. Can be used endless amount of times across query.
   */
  not(): this {
    this.isNegated = !this.isNegated;

    return this;
  }

  private resolveNegation(value: boolean): boolean {
    if (this.isNegated) {
      this.isNegated = false;
      return !value;
    }
    return value;
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

    if (this.isNegated) {
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

  protected fileSystemPathMatch(rootPath: string, fsPath: string, token: Token): boolean {
    if (typeof token === 'string') {
      const fullPath = path.join(rootPath, token);
      return this.resolveNegation(fullPath === fsPath);
    }

    const result = fsPath.match(token);
    return this.resolveNegation(result === null);
  }
}
