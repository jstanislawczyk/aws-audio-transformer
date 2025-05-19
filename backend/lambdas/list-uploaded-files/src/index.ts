import {APIGatewayProxyResult} from 'aws-lambda';
import {getAudioFiles} from './services/get-audio-files';
import {AudioMetadata, AudioMetadataDto} from '@audio-processor/schemas';

export const handler = async (): Promise<APIGatewayProxyResult> => {
    let audioFiles: AudioMetadata[];

    try {
        audioFiles = await getAudioFiles();
    } catch (error) {
        console.error('Error fetching audio files:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' }),
            headers: {
                'Content-Type': 'application/json',
            },
        };
    }

    const dtos = mapToDtos(audioFiles)

    return {
        statusCode: 200,
        body: JSON.stringify(dtos),
        headers: {
            'Content-Type': 'application/json',
        },
    }
}

const mapToDtos = (items: AudioMetadata[]): AudioMetadataDto[] => {
    return items.map((item) => ({
        id: item.id,
        createdAt: item.createdAt,
        status: item.status,
        fileName: item.fileName,
    }));
}
