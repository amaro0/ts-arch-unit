import { ClassDeclaration } from 'ts-morph';

import { ProjectMetaCrawler } from '../../ProjectMetaCrawler';
import { IDiscoveredNode, Token } from '../../types';
import { QueryBuilder } from '../QueryBuilder';
import { ClassesDependencyQueryBuilder } from './ClassesDependencyQueryBuilder';

export class ClassesQueryBuilder extends QueryBuilder {
  constructor(
    private projectMetaCrawler: ProjectMetaCrawler,
    private classDeclarations: IDiscoveredNode<ClassDeclaration>[],
  ) {
    super();
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

  extendClass(token?: Token): this {
    this.classDeclarations.forEach(cd => {
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
    this.classDeclarations.forEach(cd => {
      const interfaceDeclarations = this.projectMetaCrawler.getInterfacesForClass(cd);

      interfaceDeclarations.forEach(id => {
        if (!this.eqToken(id.getName(), token)) {
          throw new Error(`Class ${cd.value.getName()} interface ${id.getFullText()} implementation error`);
        }
      });
    });

    return this;
  }

  depend() {
    return this.chainNot(
      new ClassesDependencyQueryBuilder(this.projectMetaCrawler, this.classDeclarations),
    );
  }
}
