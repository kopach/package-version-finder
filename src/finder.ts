import { readFileSync, rmdirSync } from 'fs';
import { getAppCachePath } from './config';
import { extname } from 'path';
import * as globby from 'globby';
import { diffFiles } from './differ';
import {
  extractPackage,
  getPackageMainFile,
  getPackageVersionList,
} from './registry';
import { log, logError } from './logger';
import { compareNumbers } from './utils';

type BestMatch = {
  version: string;
  filePath: string;
  diffLevel: number;
} | null;

export async function findPackageVersion(
  packageName: string,
  comparedFileAbsolutePath: string,
  tolerancePercentage: number
): Promise<void> {
  log('🎬 Starting...');

  const versions = await getPackageVersionList(packageName);

  const bestMatch = await findBestMatch({
    versions,
    packageName,
    comparedFileAbsolutePath,
    tolerancePercentage,
  });
  cleanupCache();

  reportBestMatch(bestMatch, packageName);
}

async function findBestMatch({
  versions,
  packageName,
  comparedFileAbsolutePath,
  tolerancePercentage,
}: {
  versions: string[];
  packageName: string;
  comparedFileAbsolutePath: string;
  tolerancePercentage: number;
}): Promise<BestMatch> {
  let bestMatch: BestMatch = null;

  for (const version of versions) {
    const extractPath = await extractPackage(packageName, version);
    log(`Extracted "${packageName}@${version}": `, extractPath);

    const filePathList: string[] = await getFileList({
      packageName,
      version,
      extractPath,
      fileExtension: extname(comparedFileAbsolutePath),
    });

    if (filePathList.length === 0) {
      logError(
        `List of files to compare is empty for: "${packageName}@${version}", skipping`
      );
      continue;
    }

    bestMatch = await findBestMatchInFiles({
      extractPath,
      version,
      filePathList,
      tolerancePercentage,
      comparedFileAbsolutePath,
      previousBestMatch: bestMatch,
    });

    if (bestMatch?.diffLevel === 0) {
      log('✅ 👍 Exact match found, stopping');
      break;
    }
  }

  return bestMatch;
}

async function getFileList({
  packageName,
  version,
  fileExtension,
  extractPath,
}: {
  packageName: string;
  version: string;
  fileExtension: string;
  extractPath: string;
}): Promise<string[]> {
  const packageMainFile =
    (await getPackageMainFile(packageName, version)) || '';

  const baseName = packageMainFile.replace(fileExtension, '') || packageName;
  const patterns = [
    `${extractPath}/index${fileExtension}`,
    `${extractPath}/index\.min${fileExtension}`,
    `${extractPath}/${packageName}${fileExtension}`,
    `${extractPath}/${packageName}\.min${fileExtension}`,
    `${extractPath}/${baseName}${fileExtension}`,
    `${extractPath}/${baseName}\.min${fileExtension}`,
    `${extractPath}/dist/**/*${fileExtension}`,
    `${extractPath}/lib/**/*${fileExtension}`,
    `!${extractPath}/dist/**/*${fileExtension}?`,
    `!${extractPath}/lib/**/*${fileExtension}?`,
  ];

  const filePathList: string[] = await globby(patterns);
  log('Files to compare: ', filePathList);

  return filePathList;
}

async function findBestMatchInFiles({
  extractPath,
  version,
  filePathList,
  comparedFileAbsolutePath,
  previousBestMatch,
  tolerancePercentage,
}: {
  extractPath: string;
  version: string;
  filePathList: string[];
  comparedFileAbsolutePath: string;
  previousBestMatch: BestMatch;
  tolerancePercentage: number;
}): Promise<BestMatch> {
  let bestMatch: BestMatch = previousBestMatch;

  for (const path of filePathList) {
    log('Checking file: ', path);

    const file = readFileSync(path).toString();

    const fileToCompare = readFileSync(comparedFileAbsolutePath).toString();
    const fileLengthDiff = compareNumbers(fileToCompare.length, file.length);

    if (fileLengthDiff < tolerancePercentage) {
      log(
        `Files are too different. Below tolerance percentage:"${tolerancePercentage}%". Skipping.`
      );
      continue;
    }

    const diffResult = await diffFiles(comparedFileAbsolutePath, path);
    log('Diff level: ', diffResult?.diffLevel);

    if (
      previousBestMatch == null ||
      previousBestMatch.diffLevel > diffResult.diffLevel
    ) {
      const pathWithinPackage = path.replace(extractPath, '');

      bestMatch = {
        version,
        filePath: pathWithinPackage,
        diffLevel: diffResult.diffLevel,
      };
    }
  }

  return bestMatch;
}

function reportBestMatch(
  bestMatch: BestMatch | null,
  packageName: string
): void {
  if (bestMatch === null) {
    log('❌ Nothing found. Try reducing tolerance level');
  } else {
    log(
      '🏁 Best match: ',
      `${packageName}@${bestMatch?.version}:${bestMatch?.filePath}`,
      `Diff level: ${bestMatch?.diffLevel}`
    );
  }
}

function cleanupCache(): void {
  rmdirSync(getAppCachePath(), { recursive: true });
}
