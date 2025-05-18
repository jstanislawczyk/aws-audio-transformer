import {initS3Client} from '../clients/s3-client';
import {GetObjectCommand, GetObjectCommandOutput, PutObjectCommand} from '@aws-sdk/client-s3';
import path from 'path';
import fs from 'fs/promises';
import {S3Object, NewFileEvent} from '@audio-processor/schemas';
import {Readable} from 'stream';

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

export const uploadFileToS3 = async (mergedFilePath: string, newFileEvent: NewFileEvent): Promise<S3Object> => {
  const s3Client = initS3Client();
  const { bucketName, key } = newFileEvent.source;
  const dir = path.dirname(key);
  const ext = path.parse(mergedFilePath).ext;
  const targetKey = `${dir}/transformed${ext}`;
  const fileContent = await fs.readFile(mergedFilePath);

  const putObjectCommand = new PutObjectCommand({
    Bucket: bucketName,
    Key: targetKey,
    Body: fileContent,
  });

  try {
    await s3Client.send(putObjectCommand);
  } catch (err) {
    console.log('Error: ', err);
    throw new Error(`Failed to upload file to S3. Bucket: ${bucketName}, Key: ${targetKey}`);
  }

  return {
    bucketName,
    key: targetKey,
  }
}
