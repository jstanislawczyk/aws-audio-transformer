import {initS3Client} from '../clients/s3-client';
import {GetObjectCommand, GetObjectCommandOutput, PutObjectCommand} from '@aws-sdk/client-s3';
import fs from 'fs/promises';
import {S3Object, NewFileEvent} from '@audio-processor/schemas';
import {Readable} from 'stream';
import path from 'path';

export const fetchAudioFile = async (event: NewFileEvent, tempDirPath: string): Promise<string> => {
  console.log('Fetching audio file from S3:', JSON.stringify(event));

  const localAudioFilePath = `${tempDirPath}/${path.basename(event.source.key)}`

  const audioFile = await fetchS3File(event.source);
  await fs.writeFile(localAudioFilePath, audioFile);

  return localAudioFilePath;
}

export const fetchS3File = async (s3Object: S3Object): Promise<Readable> => {
  const s3Client = initS3Client();
  const {bucketName, key} = s3Object;
  const getObjectCommand = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });
  let data: GetObjectCommandOutput;

  try {
    data = await s3Client.send(getObjectCommand);
  } catch (err) {
    console.log('Error: ', err);
    throw new Error(`Failed to fetch file from S3. Bucket: ${bucketName}, Key: ${key}`);
  }

  if (data.Body === undefined) {
    throw new Error(`Body is undefined. Bucket: ${bucketName}, Key: ${key}`);
  }

  return data.Body as Readable;
}

export const uploadFileToS3 = async (newFileEvent: NewFileEvent, transformedAudioPath: string): Promise<S3Object> => {
  const s3Client = initS3Client();
  const { bucketName, key } = newFileEvent.source;
  const transformedKey = buildTransformedKey(newFileEvent, transformedAudioPath);

  const fileContent = await fs.readFile(transformedAudioPath);

  const putObjectCommand = new PutObjectCommand({
    Bucket: bucketName,
    Key: transformedKey,
    Body: fileContent,
  });

  try {
    await s3Client.send(putObjectCommand);
  } catch (err) {
    console.log('Error: ', err);
    throw new Error(`Failed to upload file to S3. Bucket: ${bucketName}, Key: ${key}`);
  }

  return {
    bucketName,
    key: transformedKey,
  }
}

const buildTransformedKey = (newFileEvent: NewFileEvent, transformedAudioPath: string): string => {
  const extension = path.extname(transformedAudioPath);
  const transformedFileName = `${newFileEvent.id}${extension}`;
  const [_uploadPrefix, ...parts] = path.dirname(newFileEvent.source.key).split(path.sep)

  return path.join("transformed", ...parts, transformedFileName);
}
