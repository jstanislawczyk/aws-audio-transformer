import {AudioMetadata, NewFileDto} from '@audio-transformer/schemas';
import path from 'path';

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
  const fileExtension = path.parse(newFileDto.fileName).ext;

  return `${uploadedPrefix}/${datePrefix}/${id}${fileExtension}`;
}

const getDatePrefix = (): string => {
  const date = new Date();
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1;
  const year = date.getUTCFullYear();

  return `${year}/${zeroPad(month)}/${zeroPad(day)}`;
}

const zeroPad = (value: number) => {
  return value.toString().padStart(2, "0")
};
