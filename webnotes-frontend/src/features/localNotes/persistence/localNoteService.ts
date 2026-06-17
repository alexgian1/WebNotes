import { LocalNote, LocalNoteInput } from '../model/LocalNote';
import { localNotesDb } from './localNotesDb';

/**
 * Local-only note persistence facade. UI code should call this service instead
 * of Dexie directly so a future server note store can stay separate.
 */
export async function listLocalNotes(): Promise<LocalNote[]> {
  return localNotesDb.localNotes.orderBy('updatedAt').reverse().toArray();
}

export async function getLocalNote(id: string): Promise<LocalNote | undefined> {
  return localNotesDb.localNotes.get(id);
}

export async function createLocalNote(input: LocalNoteInput): Promise<LocalNote> {
  const now = new Date().toISOString();
  const localNote: LocalNote = {
    id: crypto.randomUUID(),
    title: normalizeLocalNoteTitle(input.title),
    content: input.content,
    createdAt: now,
    updatedAt: now,
  };

  await localNotesDb.localNotes.add(localNote);

  return localNote;
}

export async function updateLocalNote(id: string, input: LocalNoteInput): Promise<void> {
  await localNotesDb.localNotes.update(id, {
    title: normalizeLocalNoteTitle(input.title),
    content: input.content,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteLocalNote(id: string): Promise<void> {
  await localNotesDb.localNotes.delete(id);
}

function normalizeLocalNoteTitle(title: string): string {
  const trimmedTitle = title.trim();

  return trimmedTitle.length > 0 ? trimmedTitle : 'Untitled note';
}
