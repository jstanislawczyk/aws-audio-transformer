import {paginateScan} from '@aws-sdk/lib-dynamodb';
import {initDocumentClient} from '../clients/document-client';
import {AudioMetadata} from '@audio-processor/schemas';

export const getAudioFiles = async (): Promise<AudioMetadata[]> => {
  const documentClient = initDocumentClient();
  const paginator = paginateScan({ client: documentClient, pageSize: 100 }, {
    TableName: process.env.AUDIO_TABLE_NAME,
  });
  const audioItems: AudioMetadata[] = [];

  for await (const page of paginator) {
    const items = (page.Items || []) as AudioMetadata[];
    audioItems.push(...items);
  }

  return audioItems;
}
