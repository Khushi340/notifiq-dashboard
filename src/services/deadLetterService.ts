import api from "../api/api";
import type { DeadLetterResponse } from "../types/types";

export const deadLetterService = {
  getAll: async (): Promise<DeadLetterResponse[]> => {
    const response = await api.get<DeadLetterResponse[]>(
      "/api/admin/dead-letters",
    );
    return response.data;
  },

  replay: async (deadLetterId: number): Promise<DeadLetterResponse> => {
    const response = await api.post<DeadLetterResponse>(
      `/api/admin/dead-letters/${deadLetterId}/replay`,
    );
    return response.data;
  },
};
