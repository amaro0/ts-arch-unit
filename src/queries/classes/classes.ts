import { bootstrap } from '../../bootstrap';
import { ClassesQueryBuilder } from './ClassesQueryBuilder';

export const classes = (): ClassesQueryBuilder => {
  const projectMetaCrawler = bootstrap();

  return new ClassesQueryBuilder(projectMetaCrawler);
};