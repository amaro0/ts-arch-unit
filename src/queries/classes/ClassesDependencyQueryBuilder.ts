import { ClassDeclaration, Symbol, SymbolFlags } from 'ts-morph';

import { ProjectMetaCrawler } from '../../ProjectMetaCrawler';
import { IDiscoveredNode } from '../../types';
import { QueryBuilder } from '../QueryBuilder';

export class ClassesDependencyQueryBuilder extends QueryBuilder {
  constructor(
    private projectMetaCrawler: ProjectMetaCrawler,
    private classDeclarations: IDiscoveredNode<ClassDeclaration>[],
  ) {
    super();
  }

  onAnyConcreteImplementation(): this {
    this.classDeclarations.forEach((cd) => {
      const { value } = cd;
      const symbols = this.getDependenciesSymbolsOfClass(value);
      const dependsOnConcrete = symbols.some((s) => s.getFlags() === SymbolFlags.Class);

      if (this.eq(dependsOnConcrete, !this.isNegated)) {
        throw new Error(`Class ${value.getName()} is dependent on concrete implementation`);
      }
    });

    return this;
  }

  onInterfaces(): this {
    this.classDeclarations.forEach((cd) => {
      const { value } = cd;
      const symbols = this.getDependenciesSymbolsOfClass(value);

      const dependsOnInterface = symbols.some((s) => s.getFlags() !== SymbolFlags.Interface);

      if (this.eq(dependsOnInterface, !this.isNegated)) {
        throw new Error(`Class ${value.getName()} is not dependent on concrete implementation`);
      }
    });

    return this;
  }

  /**
   * Not implemented yet.
   */
  onThingsThatResideOutsideOfDirectory(): this {
    throw new Error('Method not implemented.');
  }

  /**
   * Not implemented yet.
   */
  onThingsThatAreInADirectory(): this {
    throw new Error('Method not implemented.');
  }

  private getDependenciesSymbolsOfClass(cd: ClassDeclaration): Symbol[] {
    const constructors = cd.getConstructors();
    const parameters = constructors.flatMap((c) => c.getParameters());
    return parameters.map((p) => p.getType()?.getSymbol()).filter((d): d is Symbol => !!d);
  }
}
