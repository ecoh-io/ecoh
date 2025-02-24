import { useMutation, useQueryClient } from '@tanstack/react-query';
import { creatAlbumPayoload, createAlbum, deleteAlbum } from './albumClient';
import { Album } from '@/src/types/Album';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

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

export const useDeleteAlbum = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<void, Error, string>({
    mutationFn: (albumId: string) => deleteAlbum(albumId),
    onSuccess: (_, albumId) => {
      queryClient.invalidateQueries({ queryKey: ['albums'] });
      queryClient.removeQueries({ queryKey: ['album', albumId] });
      router.back();
      Alert.alert('Success', 'Album deleted successfully.');
    },
    onError: (error) => {
      Alert.alert('Error', `Failed to delete album: ${error.message}`);
    },
  });
};
