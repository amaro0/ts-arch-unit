import { bootstrap } from '../../bootstrap';
import { ClassesDependencyQueryBuilder } from './ClassesDependencyQueryBuilder';
import { ClassesQueryBuilder } from './ClassesQueryBuilder';

export { ClassesDependencyQueryBuilder, ClassesQueryBuilder };

/**
 * Starts class based query.
 */
export const classes = (): ClassesQueryBuilder => {
  const projectMetaCrawler = bootstrap();

  return new ClassesQueryBuilder(projectMetaCrawler);
};
