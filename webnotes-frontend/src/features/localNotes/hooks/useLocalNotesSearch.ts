import { useMemo, useState } from 'react';
import { LocalNote } from '../model/LocalNote';

export function useLocalNotesSearch(localNotes: LocalNote[]) {
  const [searchQuery, setSearchQuery] = useState('');

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  const filteredLocalNotes = useMemo(() => {
    if (!normalizedSearchQuery) {
      return localNotes;
    }

    return localNotes.filter((localNote) => {
      const searchableText = `${localNote.title}\n${extractPlainText(localNote.content)}`.toLowerCase();

      return searchableText.includes(normalizedSearchQuery);
    });
  }, [localNotes, normalizedSearchQuery]);

  function clearSearchQuery() {
    setSearchQuery('');
  }

  return {
    searchQuery,
    setSearchQuery,
    clearSearchQuery,
    filteredLocalNotes,
    totalLocalNotesCount: localNotes.length,
  };
}

function extractPlainText(html: string) {
  if (!html) {
    return '';
  }

  const documentFragment = new DOMParser().parseFromString(html, 'text/html');

  return documentFragment.body.textContent ?? '';
}
