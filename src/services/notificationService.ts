import api from "../api/api";
import type {
  NotificationResponse,
  NotificationStats,
  SendNotificationRequest,
} from "../types/types";

export const notificationService = {
  getStats: async (): Promise<NotificationStats> => {
    const response = await api.get<NotificationStats>(
      "/api/notifications/stats",
    );
    return response.data;
  },

  getRecent: async (): Promise<NotificationResponse[]> => {
    const response = await api.get<NotificationResponse[]>(
      "/api/notifications/recent",
    );
    return response.data;
  },

  getByUserId: async (userId: string): Promise<NotificationResponse[]> => {
    const response = await api.get<NotificationResponse[]>(
      `/api/notifications/user/${userId}`,
    );
    return response.data;
  },

  markAsRead: async (notificationId: number): Promise<NotificationResponse> => {
    const response = await api.patch<NotificationResponse>(
      `/api/notifications/${notificationId}/read`,
    );
    return response.data;
  },

  send: async (
    payload: SendNotificationRequest,
  ): Promise<NotificationResponse> => {
    const response = await api.post<NotificationResponse>(
      "/api/notifications",
      payload,
    );
    return response.data;
  },
};
