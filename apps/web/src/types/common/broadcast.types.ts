export type AuthBroadcastMessage =
  | { event: 'EMAIL_VERIFIED'; payload?: { email: string } }
  | { event: 'REGISTRATION_FULLY_COMPLETED'; payload?: null }
  | { event: 'SESSION_EXPIRED'; payload?: null }
  | { event: 'COMPLETION_REGISTRATION_TOKEN_FETCHED'; payload?: null };
