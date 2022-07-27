import { SourceFile } from 'ts-morph';

import { ProjectMetaCrawler } from '../../ProjectMetaCrawler';
import { Token } from '../../types';
import { QueryBuilder } from '../QueryBuilder';

export class FilesQueryBuilder extends QueryBuilder {
  private files: SourceFile[] = [];

  private isDependencyCheck = false;

  // REMOVE IF NOT NEEDED
  private fileDependencyMap: Map<string, SourceFile[]> = new Map();

  private dependentFiles: SourceFile[] = [];

  constructor(
    private projectMetaCrawler: ProjectMetaCrawler,
  ) {
    super();

    this.files = Array.from(projectMetaCrawler.sourceFiles);
  }

  haveMatchingName(token: Token): this {
    if (this.isDependencyCheck) {
      this.files.forEach(f => {
        const dependentFiles = this.fileDependencyMap.get(f.getFilePath());
        if (this.eq(!!(dependentFiles && dependentFiles.length), true)) {
          throw new Error(`File ${f.getBaseName()} depends on files ${dependentFiles?.map(df => df.getBaseName())}`);
        }
      });

      return this;
    }

    this.files = this.files.filter((f) => this.eqToken(f.getBaseName(), token));

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

  dependOnFiles(): this {
    this.isDependencyCheck = true;

    this.files.forEach(f => {
      const imports = f.getImportDeclarations();
      imports.forEach(i => {
        this.dependentFiles.push(i.getSourceFile());

        // REMOVE IF NOT NEEDED
        const mapNode = this.fileDependencyMap.get(f.getFilePath());
        if (mapNode) {
          this.fileDependencyMap.set(f.getFilePath(), [...mapNode, i.getSourceFile()]);
          return;
        }
        this.fileDependencyMap.set(f.getFilePath(), [i.getSourceFile()]);
      });
    });

    return this;
  }
}
