import { ClassDeclaration } from 'ts-morph';

import { ProjectMetaCrawler } from '../../ProjectMetaCrawler';
import { IDiscoveredNode, Primitives } from '../../types';
import { QueryBuilder } from '../QueryBuilder';

export class ClassesQueryBuilder extends QueryBuilder {
  constructor(
    private classDeclarations: IDiscoveredNode<ClassDeclaration>[],
    private projectMetaCrawler: ProjectMetaCrawler,
  ) {
    super();
  }

  resideInADirectory(name: string): ClassesQueryBuilder {
    this.classDeclarations.forEach((cd) => {
      const dir = this.projectMetaCrawler.getDirectoryForClass(cd);

      if (!this.eq(dir.getBaseName(), name)) {
        throw new Error(`Class ${cd.value.getName()} is not in directory ${name}`);
      }
    });

    return this;
  }

  private eq<T extends Primitives>(a: T, b: T): boolean {
    if (this.isNegated) return a !== b;

    return a === b;
  }
}
