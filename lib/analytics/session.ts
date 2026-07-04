const STORAGE_KEY = 'clymb_store_session_id';

export function getStoreSessionId(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  const existing = window.localStorage.getItem(STORAGE_KEY);
  if (existing) {
    return existing;
  }

  const sessionId =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`;

  window.localStorage.setItem(STORAGE_KEY, sessionId);
  return sessionId;
}
