export type Primitives = string | number | boolean | Symbol | BigInteger;

export type Token = string | RegExp;

export interface IDiscoveredNode<T> {
  sourceFileBaseName: string;
  value: T;
}
