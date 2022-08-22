import { SourceFile, TypeFlags } from 'ts-morph';

import { ProjectMetaCrawler } from '../../ProjectMetaCrawler';
import { Token } from '../../types';
import { QueryBuilder } from '../QueryBuilder';

export class FilesQueryBuilder extends QueryBuilder {
  private files: SourceFile[] = [];

  private isDependencyCheck = false;

  // REMOVE IF NOT NEEDED
  private fileDependencyMap: Map<string, SourceFile[]> = new Map();

  private dependentFiles: SourceFile[] = [];

  constructor(private projectMetaCrawler: ProjectMetaCrawler) {
    super();

    this.files = Array.from(projectMetaCrawler.sourceFiles);
  }

  haveMatchingName(token: Token): this {
    if (this.isDependencyCheck) {
      this.files.forEach((f) => {
        const dependentFiles = this.fileDependencyMap.get(f.getFilePath());
        if (this.eq(!!(dependentFiles && dependentFiles.length), true)) {
          throw new Error(
            `File ${f.getBaseName()} depends on files ${dependentFiles?.map((df) =>
              df.getBaseName(),
            )}`,
          );
        }
      });

      return this;
    }

    this.files = this.files.filter((f) => {
      const eq = this.eqToken(f.getBaseName(), token);
      if (!eq && this.isAssert) {
        throw new Error(`File ${f.getBaseName()} is not having a matching name ${token}`);
      }
      return eq;
    });

    return this;
  }

  shouldExist(): this {
    if (!this.files.length) throw new Error('No files exists');

    return this;
  }

  resideInADirectory(token: Token): this {
    if (this.isDependencyCheck) {
      this.files.forEach((f) => {
        const dependentFiles = this.fileDependencyMap.get(f.getFilePath());

        dependentFiles?.forEach((df) => {
          const dir = df.getDirectory();
          if (!this.eqToken(dir.getBaseName(), token)) {
            throw new Error(
              `File ${f.getBaseName()} depends on file from forbidden path ${df.getFilePath()}`,
            );
          }
        });
      });

      return this;
    }

    this.files = this.files.filter((f) => {
      const dir = f.getDirectory();
      const eq = this.eqToken(dir.getBaseName(), token);
      if (!eq && this.isAssert) {
        throw new Error(`File ${f.getBaseName()} is not in correct dir ${token}`);
      }
      return eq;
    });

    return this;
  }

  dependOnFiles(): this {
    this.isDependencyCheck = true;

    this.files.forEach((f) => {
      const imports = f.getImportDeclarations();
      imports.forEach((i) => {
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

  exportClass(): this {
    this.files = this.files.filter((f) => {
      const isClassExported = f.getClasses().some((cd) => cd.isExported());
      const isEqWithQueryCtx = this.eq(isClassExported, true);

      if (!isEqWithQueryCtx && this.isAssert) {
        throw new Error(`File ${f.getBaseName()} is not exporting class`);
      }

      return isEqWithQueryCtx;
    });

    return this;
  }

  exportInterface(): this {
    this.files = this.files.filter((f) => {
      const isInterfaceExported = f.getInterfaces().some((i) => i.isExported());
      const isEqWithQueryCtx = this.eq(isInterfaceExported, true);

      if (!isEqWithQueryCtx && this.isAssert) {
        throw new Error(`File ${f.getBaseName()} is not exporting interface`);
      }

      return isEqWithQueryCtx;
    });

    return this;
  }

  exportType(): this {
    this.files = this.files.filter((f) => {
      const isTypeExported = f.getTypeAliases().some((te) => te.isExported());
      const isEqWithQueryCtx = this.eq(isTypeExported, true);

      if (!isEqWithQueryCtx && this.isAssert) {
        throw new Error(`File ${f.getBaseName()} is not exporting types`);
      }

      return isEqWithQueryCtx;
    });

    return this;
  }

  exportSymbol(): this {
    this.files = this.files.filter((f) => {
      const isSymbolExported = f.getVariableDeclarations().some((v) => {
        return v.isExported() && v.getType().getFlags() === TypeFlags.UniqueESSymbol;
      });
      const isEqWithQueryCtx = this.eq(isSymbolExported, true);

      if (!isEqWithQueryCtx && this.isAssert) {
        throw new Error(`File ${f.getBaseName()} is not exporting symbol`);
      }

      return isEqWithQueryCtx;
    });

    return this;
  }
}
