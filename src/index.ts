import { loadConfig } from './config';
import { ProjectMetaCrawler } from './ProjectMetaCrawler';

let projectMetaCrawler: ProjectMetaCrawler | null = null;

export async function bootstrap(): Promise<ProjectMetaCrawler> {
  const config = await loadConfig();

  if (!projectMetaCrawler) {
    projectMetaCrawler = new ProjectMetaCrawler(config.fullRoot);
  }

  return projectMetaCrawler;
}
