import type {FileStatus, S3Object} from '@audio-transformer/schemas';
import {initDocumentClient} from '../clients/document-clients';
import {UpdateCommand} from '@aws-sdk/lib-dynamodb';

export const setAudioFileStatusAsProcessed = async (audioId: string, audioS3Object: S3Object): Promise<void> => {
  const documentClient = initDocumentClient();
  const updateCommand = new UpdateCommand({
    TableName: process.env.AUDIO_TABLE_NAME,
    Key: {
      id: audioId,
    },
    UpdateExpression: 'SET #status = :status, transformedObject = :transformedObject',
    ExpressionAttributeNames: {
      '#status': 'status',
    },
    ExpressionAttributeValues: {
      ':status': 'PROCESSED' satisfies FileStatus,
      ':transformedObject': audioS3Object,
    },
  });

  await documentClient.send(updateCommand);
}

export const setAudioFileStatusAsFailed = async (audioId: string): Promise<void> => {
  const documentClient = initDocumentClient();
  const updateCommand = new UpdateCommand({
    TableName: process.env.AUDIO_TABLE_NAME,
    Key: {
      id: audioId,
    },
    UpdateExpression: 'SET #status = :status',
    ExpressionAttributeNames: {
      '#status': 'status',
    },
    ExpressionAttributeValues: {
      ':status': 'FAILED' satisfies FileStatus,
    },
  });

  await documentClient.send(updateCommand);
}
