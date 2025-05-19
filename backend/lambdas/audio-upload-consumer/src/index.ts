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
        const recordKey = records[index].s3.object.key;

        if (result.status === 'rejected') {
            console.error(`Error processing record ${recordKey}:`, result.reason);
        } else {
            console.log(`Successfully processed record ${recordKey}:`);
        }
    });
}

const handleNewAudioEvent = async (record: S3EventRecord) => {
    const audioFileEvent = buildNewFileEvent(record);
    const audioId = audioFileEvent.id;

    try {
        await setAudioFileStatusAsUpdated(audioId);
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

const buildNewFileEvent = (record: S3EventRecord): NewFileEvent => {
    const s3Key = record.s3.object.key;
    const s3Bucket = record.s3.bucket.name;
    const audioId = path.parse(s3Key).name;

    if (!audioId) {
        throw new Error(`Audio ID not found in the key. Key: ${s3Key}`);
    }

    return {
        id: audioId,
        source: {
            bucketName: s3Bucket,
            key: s3Key,
        },
    };
}
