import { Visibility } from '@/src/enums/visibility.enum';
import { Album } from '@/src/types/Album';
import axiosInstance from '../axiosInstance';

export interface creatAlbumPayoload {
  name: string;
  visibility: Visibility;
  coverPhotoId: string;
}

export const fetchAlbums = async (): Promise<Album[]> => {
  const { data } = await axiosInstance.get<Album[]>('/albums');
  return data;
};

export const fetchAlbumById = async (albumId: number): Promise<Album> => {
  const { data } = await axiosInstance.get<Album>(`/albums/${albumId}`);
  return data;
};

export const createAlbum = async (
  payload: creatAlbumPayoload,
): Promise<Album> => {
  const response = await axiosInstance.post<Album>(`/albums`, payload);
  return response.data;
};
