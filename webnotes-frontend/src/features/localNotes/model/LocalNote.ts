/**
 * Persisted browser-local note record.
 * Server-backed notes should use a separate model to avoid mixing storage concerns.
 */
export type LocalNote = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type LocalNoteInput = {
  title: string;
  content: string;
};
