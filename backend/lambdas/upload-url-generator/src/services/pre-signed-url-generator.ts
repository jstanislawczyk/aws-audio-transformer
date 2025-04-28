import {PutObjectCommand} from '@aws-sdk/client-s3';
import {initS3Client} from '../clients/s3-client';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';
import {AudioMetadata} from '@audio-transformer/schemas';

export const generatePreSignedUrl = async (audioMetadata: AudioMetadata): Promise<string> => {
  const { id, uploadedObject  } = audioMetadata;
  const { bucketName, key } = uploadedObject;
  const putObjectCommand = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Metadata: {
      id,
    },
  });
  const s3Client = initS3Client();

  return getSignedUrl(s3Client, putObjectCommand, { expiresIn: 3600 })
}

