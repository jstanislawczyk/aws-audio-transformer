import {NewFileEvent} from '@audio-processor/schemas';
import {initTempDir, removeTempDir} from './services/temp-dir';
import {processAudio} from './services/audio-processor';
import {SQSEvent, SQSRecord} from 'aws-lambda';

export const handler = async (event: SQSEvent): Promise<void> => {
    const records = event.Records;

    console.log('Received event:', JSON.stringify(records.map((record) => record.body), null, 2));

    const tempDirPath = await initTempDir();

    for (const record of records) {
        await processRecord(tempDirPath, record);
    }

    await removeTempDir(tempDirPath);
}

const processRecord = async (tempDirPath: string, record: SQSRecord): Promise<void> => {
    const newFileEvent: NewFileEvent = JSON.parse(record.body);
    await processAudio(newFileEvent, tempDirPath);
}
