import { bootstrap } from '../../bootstrap';
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

      if (!classDeclarations.length) throw new Error(`No classes named ${name.toString()}`);

      return new ClassesQueryBuilder(projectMetaCrawler, classDeclarations);
    },
    resideInDirectory(dir: Token): ClassesQueryBuilder {
      const classDeclarations = projectMetaCrawler.getClassesByDirectory(dir);

      if (!classDeclarations.length) throw new Error(`No classes in directory ${dir.toString()}`);

      return new ClassesQueryBuilder(projectMetaCrawler, classDeclarations);
    },
  };
};