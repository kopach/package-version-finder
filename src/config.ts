import { resolve } from 'path';
const packageJson = require('../package.json');

export function getAppCachePath(): string {
  return resolve(process.cwd(), `.cache-${getAppName()}`);
}
export function getAppName(): string {
  return packageJson.name;
}

export function getAppVersion(): string {
  return packageJson.version;
}
