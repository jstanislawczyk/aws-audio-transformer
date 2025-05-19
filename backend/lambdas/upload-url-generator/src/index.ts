import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {NewFileDto} from '@audio-transformer/schemas';
import {generatePreSignedUrl} from './services/pre-signed-url-generator';
import {buildAudioMetadata} from './services/metadata-builder';
import {createAudioMetadataRecord} from './services/metadata-initializer';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const eventBody = event.body;

    if (!eventBody) {
        return buildResponse(
            400,
            {
                message: 'Event body is required',
            }
        );
    }

    const newFileDto = JSON.parse(eventBody) as NewFileDto;
    const audioMetadata = buildAudioMetadata(newFileDto);

    const preSignedUrl = await generatePreSignedUrl(audioMetadata);
    await createAudioMetadataRecord(audioMetadata);

    return buildResponse(
        200,
        {
            url: preSignedUrl,
        }
    );
}

const buildResponse = (statusCode: number, body: any): APIGatewayProxyResult => {
    return {
        statusCode,
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
        }
    };
}

