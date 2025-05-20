import type {NewFileEvent, S3Object} from '@audio-transformer/schemas';
import {transformAudio} from './transform-audio';
import {fetchAudioFile, uploadFileToS3} from './s3-service';

export const processAudio = async (event: NewFileEvent, tempDirPath: string): Promise<S3Object> => {
  const localAudioFilePath = await fetchAudioFile(event, tempDirPath);
  const transformedAudioPath = await transformAudio(localAudioFilePath, tempDirPath);

  return uploadFileToS3(event, transformedAudioPath);
}
