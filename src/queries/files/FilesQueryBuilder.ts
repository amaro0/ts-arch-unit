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

  resideInADirectory(token: Token): this {
    this.files = this.files.filter(f => {
      const dir = f.getDirectory();
      return this.eqToken(dir.getBaseName(), token);
    });

    return this;
  }
}
