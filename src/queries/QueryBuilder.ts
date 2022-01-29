export abstract class QueryBuilder{
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
}