import { bootstrap } from '../../bootstrap';
import { FilesQueryBuilder } from './FilesQueryBuilder';

export { FilesQueryBuilder };

export const files = (): FilesQueryBuilder => {
  const projectMetaCrawler = bootstrap();

  return new FilesQueryBuilder(projectMetaCrawler);
};
