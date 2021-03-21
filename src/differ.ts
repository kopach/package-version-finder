import * as execa from 'execa';

export type Diff = {
  diffLevel: number;
};

export async function diffFiles(
  fileAbsolutePathA: string,
  fileAbsolutePathB: string
): Promise<Diff> {
  try {
    await execa('git', [
      'diff',
      '--no-index',
      '--word-diff-regex=.',
      '--word-diff=porcelain',
      fileAbsolutePathA,
      fileAbsolutePathB,
    ]);

    return {
      diffLevel: 0,
    };
  } catch ({ stdout: fileDiff }) {
    return {
      diffLevel: fileDiff.split('\n').length,
    };
  }
}
