import { cosmiconfig, cosmiconfigSync } from 'cosmiconfig';
import * as path from 'path';

interface IConfig {
  root: string;
  fullRoot: string;
}

const CONFIG_NAME = 'noarchtest';

export function loadConfig(): IConfig {
  const explorer = cosmiconfigSync(CONFIG_NAME);
  try {
    const result = explorer.search();

    if (!result || result.isEmpty) throw new Error('Config is empty');

    const { filepath, config } = result;
    if (!config.root) throw new Error('Config root is missing');

    return { root: config.root, fullRoot: path.join(path.dirname(filepath), config.root) };
  } catch (error) {
    // if (error.message) throw new Error(`Error while loading config: ${error.message}`);

    console.error(error);
    throw new Error('Error while loading config');
  }
}
