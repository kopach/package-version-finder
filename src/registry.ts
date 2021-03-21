import { resolve } from 'path';
import { packument, extract } from 'pacote';
import { getAppCachePath } from './config';
import { log } from './logger';

export async function getPackageVersionList(
  packageName: string
): Promise<string[]> {
  const packagePackument = await packument(packageName, {
    fullMetadata: false,
  });

  const versions = Object.keys(packagePackument.versions);
  log(`Available versions for package "${packageName}": `, versions);

  return versions;
}

export async function extractPackage(
  packageName: string,
  version: string
): Promise<string> {
  const extractPath = resolve(getAppCachePath(), `${packageName}/${version}`);

  await extract(`${packageName}@${version}`, extractPath);

  return extractPath;
}

export async function getPackageMainFile(
  packageName: string,
  version: string
): Promise<string | undefined> {
  const packagePackument = await packument(`${packageName}`, {
    fullMetadata: true,
  });

  return packagePackument.versions[version].main;
}
