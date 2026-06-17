import { useEffect, useState } from 'react';
import { LocalNote } from '../model/LocalNote';
import {
  createEmptyLocalNoteDraft,
  createLocalNoteDraftFromLocalNote,
  isLocalNoteDraftDirty,
  LocalNoteDraft,
} from '../model/LocalNoteDraft';
import {
  createLocalNote,
  deleteLocalNote,
  getLocalNote,
  listLocalNotes,
  updateLocalNote,
} from '../persistence/localNoteService';

type NotificationSeverity = 'success' | 'error';

export type LocalNotesNotification = {
  message: string;
  severity: NotificationSeverity;
};

type SaveCurrentLocalNoteResult = {
  localNote: LocalNote;
  wasCreated: boolean;
};

/**
 * Coordinates the local notes workspace state and keeps persistence details out of
 * presentational components.
 */
export function useLocalNotesWorkspace() {
  const [localNotes, setLocalNotes] = useState<LocalNote[]>([]);
  const [draft, setDraft] = useState<LocalNoteDraft>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  // Target requested while the current draft has unsaved changes.
  const [pendingLocalNote, setPendingLocalNote] = useState<LocalNote>();
  const [isNewLocalNotePending, setIsNewLocalNotePending] = useState(false);
  const [notification, setNotification] = useState<LocalNotesNotification>();

  const isDirty = isLocalNoteDraftDirty(draft);
  const isPersisted = Boolean(draft?.id);
  const isUnsavedChangesDialogOpen = Boolean(pendingLocalNote || isNewLocalNotePending);

  useEffect(() => {
    void refreshLocalNotes();
  }, []);

  async function refreshLocalNotes(selectedLocalNoteId?: string) {
    const refreshedLocalNotes = await listLocalNotes();
    const selectedLocalNote = refreshedLocalNotes.find((localNote) => localNote.id === selectedLocalNoteId);

    setLocalNotes(refreshedLocalNotes);
    setDraft(selectedLocalNote ? createLocalNoteDraftFromLocalNote(selectedLocalNote) : undefined);
    setPendingLocalNote(undefined);
    setIsNewLocalNotePending(false);
  }

  function selectLocalNote(localNote: LocalNote) {
    if (localNote.id === draft?.id) {
      return;
    }

    if (isLocalNoteDraftDirty(draft)) {
      setPendingLocalNote(localNote);
      return;
    }

    applySelectedLocalNote(localNote);
  }

  function applySelectedLocalNote(localNote: LocalNote) {
    setDraft(createLocalNoteDraftFromLocalNote(localNote));
    setPendingLocalNote(undefined);
  }

  function requestCreateLocalNote() {
    if (isLocalNoteDraftDirty(draft)) {
      setIsNewLocalNotePending(true);
      return;
    }

    createLocalNoteDraft();
  }

  function createLocalNoteDraft() {
    setDraft(createEmptyLocalNoteDraft());
    setPendingLocalNote(undefined);
    setIsNewLocalNotePending(false);
  }

  function updateDraftTitle(title: string) {
    setDraft((currentDraft) => currentDraft && { ...currentDraft, title });
  }

  function updateDraftContent(content: string) {
    setDraft((currentDraft) => currentDraft && { ...currentDraft, content });
  }

  async function handleSaveLocalNote() {
    try {
      const saveResult = await saveCurrentLocalNote();

      await refreshLocalNotes(saveResult.localNote.id);
      showNotification(
        saveResult.wasCreated ? 'Local note created.' : 'Local note saved.',
        'success',
      );
    } catch {
      showNotification('Could not save local note.', 'error');
    }
  }

  async function saveCurrentLocalNote(): Promise<SaveCurrentLocalNoteResult> {
    if (!draft) {
      throw new Error('No local note draft is selected.');
    }

    // A persisted draft updates its existing IndexedDB record; a draft without an id creates one.
    if (draft.id) {
      await updateLocalNote(draft.id, { title: draft.title, content: draft.content });
      const localNote = await getLocalNote(draft.id);

      if (!localNote) {
        throw new Error('Saved local note could not be loaded.');
      }

      return {
        localNote,
        wasCreated: false,
      };
    }

    const localNote = await createLocalNote({ title: draft.title, content: draft.content });

    return {
      localNote,
      wasCreated: true,
    };
  }

  function stayOnCurrentLocalNote() {
    setPendingLocalNote(undefined);
    setIsNewLocalNotePending(false);
  }

  function discardAndExitLocalNote() {
    if (isNewLocalNotePending) {
      createLocalNoteDraft();
      return;
    }

    if (pendingLocalNote) {
      applySelectedLocalNote(pendingLocalNote);
    }
  }

  async function saveAndExitLocalNote() {
    if (!pendingLocalNote && !isNewLocalNotePending) {
      stayOnCurrentLocalNote();
      return;
    }

    try {
      const saveResult = await saveCurrentLocalNote();

      if (isNewLocalNotePending) {
        // The requested action was "new note", so save the current draft first, then open a fresh draft.
        setLocalNotes(await listLocalNotes());
        createLocalNoteDraft();
      } else if (pendingLocalNote) {
        await refreshLocalNotes(pendingLocalNote.id);
      }

      showNotification(
        saveResult.wasCreated ? 'Local note created.' : 'Local note saved.',
        'success',
      );
    } catch {
      showNotification('Could not save local note.', 'error');
    }
  }

  function openDeleteDialog() {
    setIsDeleteDialogOpen(true);
  }

  function closeDeleteDialog() {
    setIsDeleteDialogOpen(false);
  }

  async function handleDeleteLocalNote() {
    if (!draft?.id) {
      closeDeleteDialog();
      return;
    }

    try {
      await deleteLocalNote(draft.id);
      await refreshLocalNotes();
      setIsDeleteDialogOpen(false);
      showNotification('Local note deleted.', 'success');
    } catch {
      setIsDeleteDialogOpen(false);
      showNotification('Could not delete local note.', 'error');
    }
  }

  function showNotification(message: string, severity: NotificationSeverity) {
    setNotification({ message, severity });
  }

  function closeNotification() {
    setNotification(undefined);
  }

  return {
    localNotes,
    draft,
    isDirty,
    isPersisted,
    isDeleteDialogOpen,
    isUnsavedChangesDialogOpen,
    notification,
    selectLocalNote,
    requestCreateLocalNote,
    updateDraftTitle,
    updateDraftContent,
    handleSaveLocalNote,
    openDeleteDialog,
    closeDeleteDialog,
    handleDeleteLocalNote,
    stayOnCurrentLocalNote,
    discardAndExitLocalNote,
    saveAndExitLocalNote,
    closeNotification,
  };
}
