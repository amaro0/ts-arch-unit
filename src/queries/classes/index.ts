import { bootstrap } from '../../bootstrap';
import { ClassesDependencyQueryBuilder } from './ClassesDependencyQueryBuilder';
import { ClassesQueryBuilder } from './ClassesQueryBuilder';

export { ClassesDependencyQueryBuilder, ClassesQueryBuilder };

export const classes = (): ClassesQueryBuilder => {
  const projectMetaCrawler = bootstrap();

  return new ClassesQueryBuilder(projectMetaCrawler);
};
