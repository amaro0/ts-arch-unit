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

  shouldExist(): this {
    if (!this.classDeclarations.length) throw new Error('No classes exists');

    return this;
  }

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

  resideInAPath(token: Token): this {
    this.classDeclarations = this.classDeclarations.filter((cd) => {
      const sf = this.projectMetaCrawler.getSourceFileForBaseName(cd.sourceFileBaseName);

      return this.eqToken(sf.getDirectoryPath(), token);
    });

    return this;
  }

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
    this.classDeclarations.forEach((cd) => {
      const { value } = cd;

      const baseClass = value.getBaseClass();

      if (!baseClass) throw new Error(`Class ${value.getName()} does not have base class`);
      if (token && !this.eqToken(baseClass.getName()!, token)) {
        throw new Error(`Class ${value.getName()} extends incorrect class`);
      }
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

  depend(): ClassesDependencyQueryBuilder {
    return this.chainNot(
      new ClassesDependencyQueryBuilder(this.projectMetaCrawler, this.classDeclarations),
    );
  }
}
