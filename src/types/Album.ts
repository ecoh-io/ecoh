import { Visibility } from '../enums/visibility.enum';
import { Media } from './Media';

export type Album = {
  id: string;
  name: string;
  createdBy: string;
  visibility: Visibility;
  isArchived: boolean;
  mediaItems: Media[];
  coverPhoto: Media;
};
