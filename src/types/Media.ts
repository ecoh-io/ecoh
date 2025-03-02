import { MediaType } from '../enums/media-type.enum';

export type Media = {
  id: string;
  url: string;
  key: string;
  type: MediaType;
  uploadedBy: string;
  thumbnailUrl?: string;
};
