import { useMutation, useQueryClient } from '@tanstack/react-query';
import { creatAlbumPayoload, createAlbum } from './albumClient';
import { Album } from '@/src/types/Album';
import { useRouter } from 'expo-router';

export const useCreateAlbum = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<Album, Error, creatAlbumPayoload>({
    mutationFn: (payload: creatAlbumPayoload) => createAlbum(payload),
    onSuccess: (newAlbum: Album) => {
      queryClient.setQueryData<Album>(['album', newAlbum.id], newAlbum);
      router.push(`/album/${newAlbum.id}`);
    },
  });
};
