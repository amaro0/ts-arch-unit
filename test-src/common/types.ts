export type Context = { transaction: Record<string, unknown> };

export type Id = string;

export const symbolFor = Symbol.for('123');

export const symbolNew = Symbol('123');
