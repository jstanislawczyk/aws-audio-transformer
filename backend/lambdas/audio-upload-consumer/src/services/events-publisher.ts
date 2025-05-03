import {SendMessageCommand} from '@aws-sdk/client-sqs';
import {NewFileEvent} from '@audio-transformer/schemas';
import {initSQSClient} from '../clients/sqs-client';

export const publishAudioFileEvent = (audioFileEvent: NewFileEvent) => {
  const sqsClient = initSQSClient();
  const sqsPublishCommand = new SendMessageCommand({
    QueueUrl: process.env.SQS_QUEUE_URL,
    MessageBody: JSON.stringify(audioFileEvent),
    MessageGroupId: 'audio-file-events',
    MessageDeduplicationId: audioFileEvent.id,
  });

  return sqsClient.send(sqsPublishCommand);
}
