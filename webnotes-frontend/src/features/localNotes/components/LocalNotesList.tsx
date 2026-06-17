import {
  Box,
  Button,
  List,
  ListItemButton,
  Stack,
  Typography,
} from '@mui/material';
import { LocalNote } from '../model/LocalNote';

type LocalNotesListProps = {
  localNotes: LocalNote[];
  selectedLocalNoteId?: string;
  onCreateLocalNote: () => void;
  onSelectLocalNote: (localNote: LocalNote) => void;
};

export function LocalNotesList({
  localNotes,
  selectedLocalNoteId,
  onCreateLocalNote,
  onSelectLocalNote,
}: LocalNotesListProps) {
  return (
    <Stack spacing={2} sx={{ width: { xs: '100%', md: 320 }, flexShrink: 0 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
        <Typography variant="h5" component="h1">
          Local Notes
        </Typography>
        <Button variant="contained" onClick={onCreateLocalNote}>
          New Note
        </Button>
      </Stack>

      {localNotes.length === 0 ? (
        <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2 }}>
          <Typography color="text.secondary">
            No local notes yet.
          </Typography>
        </Box>
      ) : (
        <List disablePadding sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
          {localNotes.map((localNote) => (
            <ListItemButton
              key={localNote.id}
              selected={localNote.id === selectedLocalNoteId}
              onClick={() => onSelectLocalNote(localNote)}
            >
              <Stack spacing={0.5}>
                <Typography>{localNote.title}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(localNote.updatedAt).toLocaleString()}
                </Typography>
              </Stack>
            </ListItemButton>
          ))}
        </List>
      )}
    </Stack>
  );
}
