import type {NewFileEvent, S3Object} from '@audio-processor/schemas';
import {transformAudio} from './transform-audio';
import fs from 'fs/promises';
import path from 'path';
import {fetchS3File, uploadFileToS3} from './s3-service';

export const processAudio = async (event: NewFileEvent, tempDirPath: string): Promise<S3Object> => {
  const localAudioFilePath = await fetchAudioFile(event, tempDirPath);
  const transformedAudioPath = await transformAudio(localAudioFilePath, tempDirPath);

  return uploadFileToS3(transformedAudioPath, event);
}

const fetchAudioFile = async (event: NewFileEvent, tempDirPath: string): Promise<string> => {
  console.log('Fetching audio file from S3:', JSON.stringify(event));

  const localAudioFilePath = `${tempDirPath}/${path.basename(event.source.key)}`

  const audioFile = await fetchS3File(event.source);
  await fs.writeFile(localAudioFilePath, audioFile);

  return localAudioFilePath;
}
