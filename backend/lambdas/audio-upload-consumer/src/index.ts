import {NewFileEvent} from '@audio-transformer/schemas';
import {S3Event, S3EventRecord} from 'aws-lambda';
import path from 'path';
import {publishAudioFileEvent} from './services/events-publisher';
import {setAudioFileStatusAsUpdated} from './services/file-status-handler';

export const handler = async (event: S3Event): Promise<void> => {
    const records = event.Records;

    console.log('Received events: ', records.map((record) => record.s3.object.key));

    const promises = records.map(handleNewAudioEvent);

    const results = await Promise.allSettled(promises);

    results.forEach((result, index) => {
        if (result.status === 'rejected') {
            console.error(`Error processing record ${index}:`, result.reason);
        } else {
            console.log(`Successfully processed record ${index}`);
        }
    });
}

const handleNewAudioEvent = async (record: S3EventRecord) => {
    const s3Key = record.s3.object.key;
    const s3Bucket = record.s3.bucket.name;
    const parsedPath = path.parse(s3Key);
    const audioId = parsedPath.dir.split('/').pop();

    if (!audioId) {
        throw new Error(`Audio ID not found in the key. Key: ${s3Key}`);
    }

    const audioFileEvent: NewFileEvent = {
        id: audioId,
        source: {
            bucketName: s3Bucket,
            key: s3Key,
        }
    };

    try {
        await setAudioFileStatusAsUpdated(audioFileEvent.id);
    } catch (error) {
        console.error('Error updating audio file status:', error);
        throw new Error(`Error updating audio file status. ID: ${audioId}`);
    }

    try {
        await publishAudioFileEvent(audioFileEvent);
    } catch (error) {
        console.error('Error publishing audio file event:', error);
        throw new Error(`Error publishing audio file event. ID: ${audioId}`);
    }
}
