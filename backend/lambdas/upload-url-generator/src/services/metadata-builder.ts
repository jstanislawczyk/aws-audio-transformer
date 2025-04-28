import {AudioMetadata, NewFileDto} from '@audio-transformer/schemas';

export const buildAudioMetadata = (newFileDto: NewFileDto): AudioMetadata => {
  const bucketName = process.env.BUCKET_NAME || "";
  const id = crypto.randomUUID();
  const key = buildKey(id, newFileDto);

  return {
    id,
    uploadedObject: {
      bucketName,
      key,
    },
    fileName: newFileDto.fileName,
    createdAt: Date.now(),
    status: 'INITIALIZED',
  }
}

const buildKey = (id: string, newFileDto: NewFileDto): string => {
  const uploadedPrefix = process.env.UPLOADED_PREFIX || "";
  const datePrefix = getDatePrefix();

  return `${uploadedPrefix}/${datePrefix}/${id}/${newFileDto.fileName}`;
}

const getDatePrefix = (): string => {
  const date = new Date();
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1;
  const year = date.getUTCFullYear();

  return `${year}/${month}/${day}`;
}
