import { SourceFile, SyntaxKind, TypeFlags } from 'ts-morph';

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

  /**
   * Filters or asserts files by method name.
   */
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

  /**
   * Asserts that there are files for selected filters.
   */
  shouldExist(): this {
    if (!this.files.length) throw new Error('No files exists');

    return this;
  }

  /**
   * Asserts that there are no files for selected filters.
   */
  shouldNotExist(): this {
    if (this.files.length) throw new Error('Files do exists');

    return this;
  }

  /**
   * Filters or asserts files by directory.
   */
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

  /**
   * Filters or asserts files by path.
   */
  resideInAPath(path: Token): this {
    if (this.isDependencyCheck) {
      this.files.forEach((f) => {
        const dependentFiles = this.fileDependencyMap.get(f.getFilePath());

        dependentFiles?.forEach((df) => {
          const filePath = df.getDirectoryPath();
          if (!this.fileSystemPathMatch(this.projectMetaCrawler.rootPath, filePath, path)) {
            throw new Error(
              `File ${f.getBaseName()} depends on file from forbidden path ${df.getFilePath()}`,
            );
          }
        });
      });

      return this;
    }

    this.files = this.files.filter((f) => {
      const filePath = f.getDirectoryPath();
      const eq = this.fileSystemPathMatch(this.projectMetaCrawler.rootPath, filePath, path);
      if (!eq && this.isAssert) {
        throw new Error(`File ${f.getBaseName()} is not in correct path ${path}`);
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
        const importedSourceFile = i.getModuleSpecifierSourceFile();

        if (!importedSourceFile) return;

        this.dependentFiles.push(importedSourceFile);

        // REMOVE IF NOT NEEDED
        const mapNode = this.fileDependencyMap.get(f.getFilePath());
        if (mapNode) {
          this.fileDependencyMap.set(f.getFilePath(), [...mapNode, importedSourceFile]);
          return;
        }
        this.fileDependencyMap.set(f.getFilePath(), [importedSourceFile]);
      });
    });

    return this;
  }

  /**
   * Filters or asserts files with exported classes.
   */
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

  /**
   * Filters or asserts files with exported interfaces.
   */
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

  /**
   * Filters or asserts files with exported types.
   */
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

  /**
   * Filters or asserts files with exported symbols.
   */
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

  /**
   * Filters or asserts files with exported functions.
   */
  exportFunction(): this {
    this.files = this.files.filter((f) => {
      const isFunctionExported = f.getFunctions().some((func) => func.isExported());
      const isArrowFunctionExported = f
        .getVariableDeclarations()
        .some(
          (vd) => vd.isExported() && vd.getInitializer()?.getKind() === SyntaxKind.ArrowFunction,
        );
      const isEqWithQueryCtx = this.eq(isFunctionExported || isArrowFunctionExported, true);

      if (!isEqWithQueryCtx && this.isAssert) {
        throw new Error(`File ${f.getBaseName()} is not exporting symbol`);
      }

      return isEqWithQueryCtx;
    });

    return this;
  }

  /**
   * Excludes files from future asserts by name.
   */
  excludedByMatchingName(token: Token): this {
    this.files = this.files.filter((f) => {
      return !this.eqToken(f.getBaseName(), token);
    });

    return this;
  }

  /**
   * Excludes files from future asserts by name.
   */
  excludedByPath(token: Token): this {
    this.files = this.files.filter((f) => {
      return !this.eqToken(f.getDirectoryPath(), token);
    });

    return this;
  }

  /**
   * Filters or asserts files by paths where they are imported.
   */
  importedOutsideOfPath(token: Token): this {
    this.files = this.files.filter((f) => {
      const referencingFiles = f.getReferencingSourceFiles();
      return referencingFiles.some((rf) => {
        const isEq = this.eqToken(rf.getDirectoryPath(), token);
        if (isEq && this.isAssert) {
          throw new Error(`File ${f.getFilePath()} is imported in ${token}`);
        }
        return isEq;
      });
    });

    return this;
  }

  /**
   * Filters or asserts files by directory names where they are imported.
   */
  importedOutsideOfDirectory(token: Token): this {
    this.files = this.files.filter((f) => {
      const referencingFiles = f.getReferencingSourceFiles();
      return referencingFiles.some((rf) => {
        const isEq = this.eqToken(rf.getDirectory().getBaseName(), token);
        if (isEq && this.isAssert) {
          throw new Error(`File ${f.getFilePath()} is imported in ${token}`);
        }
        return isEq;
      });
    });

    return this;
  }

  /**
   * Filters or asserts files by imports from current outside current directory
   */
  importedOutsideOfCurrentDirectory(): this {
    this.files = this.files.filter((f) => {
      const referencingFiles = f.getReferencingSourceFiles();
      return referencingFiles.some((rf) => {
        const isEq = this.eq(rf.getDirectoryPath(), f.getDirectoryPath());
        if (isEq && this.isAssert) {
          throw new Error(`File ${f.getFilePath()} is imported outside of it's current directory`);
        }
        return isEq;
      });
    });

    return this;
  }
}
