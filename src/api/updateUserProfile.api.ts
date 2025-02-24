import { UpdateUserProfileData } from '../types/updateUserProfile.data';
import { UpdateUserProfileResponse } from '../types/updateUserProfile.reposnse';
import axiosInstance from './axiosInstance';

export const updateUserProfile = async (
  formData: UpdateUserProfileData,
  id: string,
): Promise<UpdateUserProfileResponse> => {
  const response = await axiosInstance.put<UpdateUserProfileResponse>(
    `/users/${id}`,
    formData,
  );
  return response.data;
};
