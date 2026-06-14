import api from "../api/api";
import type { UpdatePreferenceRequest, UserPreference } from "../types/types";

export const userService = {
  getPreference: async (userId: number): Promise<UserPreference> => {
    const response = await api.get<UserPreference>(
      `/api/users/${userId}/preferences`,
    );
    return response.data;
  },

  updatePreference: async (
    userId: number,
    payload: UpdatePreferenceRequest,
  ): Promise<UserPreference> => {
    const response = await api.put<UserPreference>(
      `/api/users/${userId}/preferences`,
      payload,
    );
    return response.data;
  },
};
