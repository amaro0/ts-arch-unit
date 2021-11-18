import { ClassDeclaration } from 'ts-morph';

import { ProjectMetaCrawler } from '../ProjectMetaCrawler';
import { IDiscoveredNode } from '../types';

export class ClassesQueryBuilder {
  private isNegated: boolean = false;

  constructor(
    private classDeclarations: IDiscoveredNode<ClassDeclaration>[],
    private projectMetaCrawler: ProjectMetaCrawler,
  ) {}

  that(): ClassesQueryBuilder {
    return this;
  }

  should(): ClassesQueryBuilder {
    return this;
  }

  not(): ClassesQueryBuilder {
    this.isNegated = true;

    return this;
  }

  resideInADirectory(name: string): ClassesQueryBuilder {
    this.classDeclarations.forEach((cd) => {
      const dir = this.projectMetaCrawler.getDirectoryForClass(cd);

      if (dir.getBaseName() !== name)
        throw new Error(`Class ${cd.value.getName()} is not in directory ${name}`);
    });

    return this;
  }
}
