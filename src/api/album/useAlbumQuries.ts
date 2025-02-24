import { Album } from '@/src/types/Album';
import { useQuery } from '@tanstack/react-query';
import { fetchAlbumById, fetchAlbums } from './albumClient';

export const useAlbums = () => {
  return useQuery<Album[], Error>({
    queryKey: ['albums'],
    queryFn: fetchAlbums,
    staleTime: 1000 * 60 * 5, // Cache the album list for 5 minutes
  });
};

export const useAlbum = (albumId: string) => {
  return useQuery<Album, Error>({
    queryKey: ['album', albumId],
    queryFn: () => fetchAlbumById(albumId),
    staleTime: 1000 * 60 * 10, // Cache album details for 10 minutes
  });
};
