import {S3Object} from './s3';

export interface NewFileEvent {
  id: string;
  source: S3Object;
}
