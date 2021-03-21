#!/usr/bin/env node

import { resolve } from 'path';
import { program } from 'commander';
import { findPackageVersion } from './finder';
import { getAppName, getAppVersion } from './config';

const packageOptionName = 'package';

program
  .name(getAppName())
  .version(getAppVersion())
  .requiredOption(`-p, --${packageOptionName} <name>`, 'name of npm package')
  .option(
    `-t, --tolerance-percentage <percentage>`,
    'Skip comparison for files with less equality in size then accepted by tolerance level',
    myParseInt,
    90
  )
  .arguments('<file>')
  .action(
    async (
      file: string,
      { [packageOptionName]: packageName }: { [packageOptionName]: string }
    ): Promise<void> => {
      const options = program.opts();
      const comparedFileAbsolutePath = resolve(process.cwd(), file);

      await findPackageVersion(
        packageName,
        comparedFileAbsolutePath,
        options.tolerancePercentage
      );
    }
  )
  .parse();

function myParseInt(value: string): number {
  const parsedValue = parseInt(value, 10);

  if (isNaN(parsedValue)) {
    throw new TypeError(`Parameter value: "${value}" is not a number.`);
  }

  return parsedValue;
}
