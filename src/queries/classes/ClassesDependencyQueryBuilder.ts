import { ClassDeclaration } from 'ts-morph';

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