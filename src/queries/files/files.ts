import { bootstrap } from '../../index';
import { FilesQueryBuilder } from './FilesQueryBuilder';

export const files = (): FilesQueryBuilder => {
  const projectMetaCrawler = bootstrap();

  return new FilesQueryBuilder(projectMetaCrawler);
};