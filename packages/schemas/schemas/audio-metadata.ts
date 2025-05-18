import {S3Object} from './s3';

export interface AudioMetadata {
  id: string;
  uploadedObject: S3Object;
  transformedObject?: S3Object;
  fileName: string;
  status: FileStatus;
  createdAt: number;
}

export interface AudioMetadataDto {
  id: string;
  fileName: string;
  status: FileStatus;
  createdAt: number;
}

export type FileStatus = 'INITIALIZED' | 'UPLOADED' | 'PROCESSED' | 'FAILED';
