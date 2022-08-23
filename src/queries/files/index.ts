import { bootstrap } from '../../bootstrap';
import { FilesQueryBuilder } from './FilesQueryBuilder';

export { FilesQueryBuilder };

/**
 * Starts file based query.
 */
export const files = (): FilesQueryBuilder => {
  const projectMetaCrawler = bootstrap();

  return new FilesQueryBuilder(projectMetaCrawler);
};
