import { bootstrap } from '../../index';
import { Token } from '../../types';
import { ClassesQueryBuilder } from './ClassesQueryBuilder';

const projectMetaCrawler = bootstrap();

interface IClasses {
  that(): this;

  haveMatchingName(name: Token): ClassesQueryBuilder;

  resideInDirectory(dir: Token): ClassesQueryBuilder;
}

export const classes = (): IClasses => {
  return {
    that(): IClasses {
      return this;
    },
    haveMatchingName(name: Token): ClassesQueryBuilder {
      const classDeclarations = projectMetaCrawler.getClassesByName(name);

      if (!classDeclarations.length) throw new Error(`Class ${name} not declared`);

      return new ClassesQueryBuilder(projectMetaCrawler, classDeclarations);
    },
    resideInDirectory(dir: Token): ClassesQueryBuilder {
      const classDeclaration = projectMetaCrawler.getClassesByName(dir);

      if (!classDeclaration) throw new Error(`Class ${name} not declared`);

      return new ClassesQueryBuilder(projectMetaCrawler, classDeclaration);
    },
  };
};