import { LocalNote } from './LocalNote';

/**
 * Editable local note state.
 * The saved fields are the last persisted values and are used to derive dirty state.
 */
export type LocalNoteDraft = {
  id?: string;
  title: string;
  content: string;
  savedTitle: string;
  savedContent: string;
};

export function createEmptyLocalNoteDraft(): LocalNoteDraft {
  return {
    title: 'Untitled note',
    content: '',
    savedTitle: '',
    savedContent: '',
  };
}

export function createLocalNoteDraftFromLocalNote(localNote: LocalNote): LocalNoteDraft {
  return {
    id: localNote.id,
    title: localNote.title,
    content: localNote.content,
    savedTitle: localNote.title,
    savedContent: localNote.content,
  };
}

export function isLocalNoteDraftDirty(localNoteDraft?: LocalNoteDraft): boolean {
  return Boolean(
    localNoteDraft
      && (
        localNoteDraft.title !== localNoteDraft.savedTitle
        || localNoteDraft.content !== localNoteDraft.savedContent
      ),
  );
}
