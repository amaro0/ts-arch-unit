import { loadConfig } from './config';
import { ProjectMetaCrawler } from './ProjectMetaCrawler';

let projectMetaCrawler: ProjectMetaCrawler | null = null;

export function bootstrap(): ProjectMetaCrawler {
  const config = loadConfig();

  if (!projectMetaCrawler) {
    projectMetaCrawler = new ProjectMetaCrawler(config.fullRoot);
  }

  return projectMetaCrawler;
}
