import { ClassDeclaration, SymbolFlags } from 'ts-morph';

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
    this.classDeclarations.forEach(cd => {
      const { value } = cd;
      const constructors = value.getConstructors();
      const parameters = constructors.flatMap(c => c.getParameters());
      const dependsOnConcrete = parameters.some(
        p => p.getType()?.getSymbol()?.getFlags() === SymbolFlags.Class,
      );

      if (this.eq(dependsOnConcrete, !this.isNegated)) {
        throw new Error(`Class ${value.getName()} is dependent on concrete implementation`);
      }
    });

    return this;
  }

  onInterfaces(): this {
    return this;
  }

  onThingsThatResideOutsideOfDirectory(): this {
    return this;
  }

  onThingsThatAreInADirectory(): this {
    return this;
  }
}