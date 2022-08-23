import { ClassDeclaration } from 'ts-morph';

import { ProjectMetaCrawler } from '../../ProjectMetaCrawler';
import { IDiscoveredNode, Token } from '../../types';
import { QueryBuilder } from '../QueryBuilder';
import { ClassesDependencyQueryBuilder } from './ClassesDependencyQueryBuilder';

export class ClassesQueryBuilder extends QueryBuilder {
  private classDeclarations: IDiscoveredNode<ClassDeclaration>[] = [];

  constructor(private projectMetaCrawler: ProjectMetaCrawler) {
    super();

    this.classDeclarations = Array.from(this.projectMetaCrawler.classesArr);
  }

  /**
   * Asserts that there are classes for selected filters.
   */
  shouldExist(): this {
    if (!this.classDeclarations.length) throw new Error('No classes exists');

    return this;
  }

  /**
   * Filters or asserts classes by name.
   */
  haveMatchingName(token: Token): ClassesQueryBuilder {
    this.classDeclarations = this.classDeclarations.filter((node) => {
      const eq = this.eqToken(node.value.getName() ?? '', token);
      if (!eq && this.isAssert) {
        throw new Error(`Class ${node.value.getName()} is not having a matching name ${token}`);
      }
      return eq;
    });

    return this;
  }

  /**
   * Filters or asserts classes by path.
   */
  resideInAPath(token: Token): this {
    this.classDeclarations = this.classDeclarations.filter((cd) => {
      const sf = this.projectMetaCrawler.getSourceFileForBaseName(cd.sourceFileBaseName);

      return this.eqToken(sf.getDirectoryPath(), token);
    });

    return this;
  }

  /**
   * Filters or asserts classes by directory.
   */
  resideInADirectory(token: Token): this {
    this.classDeclarations = this.classDeclarations.filter((cd) => {
      const dir = this.projectMetaCrawler.getDirectoryForClass(cd);
      const eq = this.eqToken(dir.getBaseName(), token);

      if (!eq && this.isAssert) {
        throw new Error(`Class ${cd.value.getName()} is not in a dir ${token}`);
      }
      return eq;
    });

    return this;
  }

  extendClass(token?: Token): this {
    this.classDeclarations = this.classDeclarations.filter((cd) => {
      const { value } = cd;

      const baseClass = value.getBaseClass();

      if (this.isAssert) {
        if (!baseClass) throw new Error(`Class ${value.getName()} does not have base class`);
        if (token && !this.eqToken(baseClass.getName()!, token)) {
          throw new Error(`Class ${value.getName()} extends incorrect class`);
        }
      }

      if (!token) return this.eq(!!baseClass, true);
      if (token && baseClass) {
        return this.eqToken(baseClass.getName() ?? '', token);
      }
      return false;
    });

    return this;
  }

  implementInterface(token: Token): this {
    this.classDeclarations.forEach((cd) => {
      const interfaceDeclarations = this.projectMetaCrawler.getInterfacesForClass(cd);

      interfaceDeclarations.forEach((id) => {
        if (!this.eqToken(id.getName(), token)) {
          throw new Error(
            `Class ${cd.value.getName()} interface ${id.getFullText()} implementation error`,
          );
        }
      });
    });

    return this;
  }

  /**
   * Switches query to class dependency. Passes currently filtered classes
   */
  depend(): ClassesDependencyQueryBuilder {
    return this.chainNot(
      new ClassesDependencyQueryBuilder(this.projectMetaCrawler, this.classDeclarations),
    );
  }

  /**
   * Excludes classes from future asserts by name.
   */
  excludedByMatchingName(token: Token): this {
    this.classDeclarations = this.classDeclarations.filter((cd) => {
      return !this.eqToken(cd.value.getName() ?? '', token);
    });

    return this;
  }

  /**
   * Filters or asserts classes by method name.
   */
  haveMatchingMethod(token: Token): this {
    this.classDeclarations = this.classDeclarations.filter((cd) => {
      const methods = cd.value.getMethods();

      const hasMethod = methods.some((method) => this.eqToken(method.getName(), token));

      if (!hasMethod && this.isAssert) {
        throw new Error(`Method ${token} is not found in class ${cd.value.getName()}`);
      }

      return hasMethod;
    });

    return this;
  }

  /**
   * Filters or asserts classes by abstract method name.
   */
  haveMatchingAbstractMethod(token?: Token): this {
    this.classDeclarations = this.classDeclarations.filter((cd) => {
      const methods = cd.value.getMethods();

      const hasMethod = methods.some(
        (method) =>
          (!token && method.isAbstract()) ||
          (token && method.isAbstract() && this.eqToken(method.getName(), token)),
      );

      if (!hasMethod && this.isAssert) {
        throw new Error(
          `Abstract method ${token ?? ''} is not found in class ${cd.value.getName()}`,
        );
      }

      return hasMethod;
    });

    return this;
  }

  /**
   * Filters or asserts classes by checking if class is abstract.
   */
  abstract(): this {
    this.classDeclarations = this.classDeclarations.filter((cd) => {
      const isAbstract = cd.value.isAbstract();

      if (!isAbstract && this.isAssert) {
        throw new Error(`Class ${cd.value.getName()} is not abstract`);
      }

      return isAbstract;
    });

    return this;
  }
}
