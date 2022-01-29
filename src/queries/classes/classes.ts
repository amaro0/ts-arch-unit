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
      const classDeclaration = projectMetaCrawler.getClassByName(name);

      if (!classDeclaration) throw new Error(`Class ${name} not declared`);

      return new ClassesQueryBuilder([classDeclaration], projectMetaCrawler);
    },
    resideInDirectory(dir: Token): ClassesQueryBuilder {
      const classDeclaration = projectMetaCrawler.getClassByName(dir);

      if (!classDeclaration) throw new Error(`Class ${name} not declared`);

      return new ClassesQueryBuilder([classDeclaration], projectMetaCrawler);
    },
  };
};