import { ClassDeclaration } from 'ts-morph';

import { ProjectMetaCrawler } from '../ProjectMetaCrawler';

export class ClassesQueryBuilder {
  private isNegated: boolean = false;

  constructor(
    private classDeclarations: ClassDeclaration[],
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
    return this;
  }
}
