import Dexie, { Table } from 'dexie';
import { LocalNote } from '../model/LocalNote';

/**
 * Browser-local IndexedDB database for offline/local notes only.
 * Server-hosted note storage should use a separate API/store module.
 */
class LocalNotesDatabase extends Dexie {
  localNotes!: Table<LocalNote, string>;

  constructor() {
    super('webnotes-local-notes');

    this.version(1).stores({
      localNotes: 'id, title, updatedAt',
    });
  }
}

export const localNotesDb = new LocalNotesDatabase();
