import fs from 'fs/promises';

export const initTempDir = async (): Promise<string> => {
  const prefix = process.env.IS_LAMBDA ? '/tmp/' : './tmp/';

  return fs.mkdtemp(prefix);
}

export const removeTempDir = async (tempDirPath: string): Promise<void> => {
  try {
    await fs.rm(tempDirPath, { recursive: true });
  } catch (error) {
    console.error(`Failed to remove temp directory: ${tempDirPath}`, error);
  }
}
