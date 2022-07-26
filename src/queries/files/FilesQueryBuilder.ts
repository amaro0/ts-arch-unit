import { SourceFile } from 'ts-morph';

import { ProjectMetaCrawler } from '../../ProjectMetaCrawler';
import { Token } from '../../types';
import { QueryBuilder } from '../QueryBuilder';

export class FilesQueryBuilder extends QueryBuilder {
  private files: SourceFile[] = [];

  constructor(
    private projectMetaCrawler: ProjectMetaCrawler,
  ) {
    super();

    this.files = Array.from(projectMetaCrawler.sourceFiles);
  }

  haveMatchingName(token: Token): this {
    if (typeof token === 'string') {
      this.files = this.files.filter((f) => f.getBaseName() === token);
      return this;
    }

    this.files = this.files.filter((f) => token.test(f.getBaseName()));

    return this;
  }

  shouldExist(): this {
    if (!this.files.length) throw new Error('No files exists');

    return this;
  }


  resideInADirectory(name: string): this {
    this.classDeclarations.forEach((cd) => {
      const dir = this.projectMetaCrawler.getDirectoryForClass(cd);

      if (!this.eq(dir.getBaseName(), name)) {
        throw new Error(`Class ${cd.value.getName()} is not in directory ${name}`);
      }
    });

    return this;
  }
}
