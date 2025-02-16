import { MediaType } from '../enums/media-type.enum';
import { Album } from './Album';

export type Media = {
  id: string;
  url: string;
  key: string;
  type: MediaType;
  uploadedBy: string;
};
