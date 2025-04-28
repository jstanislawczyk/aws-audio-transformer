import {initDocumentClient} from '../clients/document-clients';
import {PutCommand} from '@aws-sdk/lib-dynamodb';
import {AudioMetadata} from '@audio-transformer/schemas';

export const createAudioMetadataRecord = async (audioMetadata: AudioMetadata): Promise<void> => {
  const documentClient = initDocumentClient();
  const putCommand = new PutCommand({
    TableName: process.env.AUDIO_JOB_TABLE_NAME,
    Item: audioMetadata,
  });

  await documentClient.send(putCommand);
}
