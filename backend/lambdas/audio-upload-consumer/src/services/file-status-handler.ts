import {FileStatus} from '@audio-transformer/schemas';
import {initDocumentClient} from '../clients/document-clients';
import {UpdateCommand} from '@aws-sdk/lib-dynamodb';

export const setAudioFileStatusAsUpdated = async (audioId: string): Promise<void> => {
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
      ':status': 'UPLOADED' satisfies FileStatus,
    },
  });

  await documentClient.send(updateCommand);
}
