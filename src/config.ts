import { cosmiconfigSync } from 'cosmiconfig';
import * as path from 'path';

interface IConfig {
  root: string;
  fullRoot: string;
}

const CONFIG_NAME = 'tsarchunit';

export function loadConfig(): IConfig {
  const explorer = cosmiconfigSync(CONFIG_NAME);

  const result = explorer.search();

  if (!result || result.isEmpty) throw new Error('Config is empty');

  const { filepath, config } = result;
  if (!config.root) throw new Error('Config root is missing');

  return { root: config.root, fullRoot: path.join(path.dirname(filepath), config.root) };
}
