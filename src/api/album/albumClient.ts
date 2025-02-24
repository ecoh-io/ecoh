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

export const fetchAlbumById = async (albumId: string): Promise<Album> => {
  const { data } = await axiosInstance.get<Album>(`/albums/${albumId}`);
  return data;
};

export const createAlbum = async (
  payload: creatAlbumPayoload,
): Promise<Album> => {
  const response = await axiosInstance.post<Album>(`/albums`, payload);
  return response.data;
};

export const deleteAlbum = async (albumId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/albums/${albumId}`);
  } catch (error) {
    console.error(`Failed to delete album with ID ${albumId}:`, error);
    throw new Error('Failed to delete album. Please try again later.');
  }
};
