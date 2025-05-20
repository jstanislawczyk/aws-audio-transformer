import {APIGatewayProxyResult} from 'aws-lambda';
import {getAudioFiles} from './services/get-audio-files';
import {AudioMetadata, AudioMetadataDto} from '@audio-transformer/schemas';
import {buildResponse} from '@audio-transformer/utils';

export const handler = async (): Promise<APIGatewayProxyResult> => {
    let audioFiles: AudioMetadata[];

    try {
        audioFiles = await getAudioFiles();
    } catch (error) {
        console.error('Error fetching audio files:', error);
        return buildResponse(500, { message: 'Internal Server Error' });
    }

    const dtos = mapToDtos(audioFiles)

    return buildResponse(200, { items: dtos });
}

const mapToDtos = (items: AudioMetadata[]): AudioMetadataDto[] => {
    return items.map((item) => ({
        id: item.id,
        createdAt: item.createdAt,
        status: item.status,
        fileName: item.fileName,
    }));
}
