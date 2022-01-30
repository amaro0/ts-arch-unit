import { ClassDeclaration } from 'ts-morph';

import { ProjectMetaCrawler } from '../../ProjectMetaCrawler';
import { IDiscoveredNode, Token } from '../../types';
import { QueryBuilder } from '../QueryBuilder';

export class ClassesQueryBuilder extends QueryBuilder {
  constructor(
    private classDeclarations: IDiscoveredNode<ClassDeclaration>[],
    private projectMetaCrawler: ProjectMetaCrawler,
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

  implementsInterface(token: Token): this {
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


}
