export interface NotificationStats {
  totalNotifications: number;
  sentNotifications: number;
  queuedNotifications: number;
  retryingNotifications: number;
  failedNotifications: number;
  deadLetteredNotifications: number;
  skippedByPreferenceNotifications: number;
  unreadInAppNotifications: number;
}

export interface NotificationResponse {
  id: number;
  userId: number;
  type: string;
  channel: string;
  priority: string;
  status: string;
  subject: string | null;
  message: string;
  idempotencyKey: string;
  retryCount: number;
  createdAt: string;
  sentAt: string | null;
  readAt: string | null;
  nextRetryAt: string | null;
}

export interface DeadLetterResponse {
  id: number;
  notificationId: number;
  userId: number;
  type: string;
  channel: string;
  priority: string;
  subject: string | null;
  message: string;
  reason: string;
  retryCount: number;
  failedAt: string;
}

export interface UserPreference {
  id: number;
  userId: number;
  emailEnabled: boolean;
  inAppEnabled: boolean;
  webhookEnabled: boolean;
  webhookUrl: string | null;
  quietHoursEnabled: boolean;
  quietHoursStart: string | null;
  quietHoursEnd: string | null;
  preferredChannel: string;
}

export type FetchState<T> =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: T };

export interface SendNotificationRequest {
  userId: number;
  type: string;
  channel: string;
  priority: string;
  subject?: string;
  message: string;
  idempotencyKey: string;
}

export interface UpdatePreferenceRequest {
  emailEnabled: boolean;
  inAppEnabled: boolean;
  webhookEnabled: boolean;
  webhookUrl: string | null;
  quietHoursEnabled: boolean;
  quietHoursStart: string | null;
  quietHoursEnd: string | null;
  preferredChannel: string;
}
