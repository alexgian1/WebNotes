import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { LocalNoteDraft } from '../model/LocalNoteDraft';

type LocalNoteEditorProps = {
  draft?: LocalNoteDraft;
  isDirty: boolean;
  isPersisted: boolean;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onSave: () => void;
  onDelete: () => void;
};

export function LocalNoteEditor({
  draft,
  isDirty,
  isPersisted,
  onTitleChange,
  onContentChange,
  onSave,
  onDelete,
}: LocalNoteEditorProps) {
  if (!draft) {
    return (
      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 3 }}>
        <Typography color="text.secondary">
          Create a local note to start writing.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <TextField
        label="Title"
        value={draft.title}
        onChange={(event) => onTitleChange(event.target.value)}
        fullWidth
      />
      <ReactQuill
        className="local-note-editor"
        theme="snow"
        value={draft.content}
        onChange={onContentChange}
      />
      <Stack
        direction="row"
        spacing={1}
        sx={{ pt: 2, borderTop: '1px solid', borderColor: 'divider' }}
      >
        <Button
          variant="contained"
          disabled={!isDirty}
          onClick={onSave}
        >
          Save
        </Button>
        <Button
          color="error"
          disabled={!isPersisted}
          onClick={onDelete}
        >
          Delete
        </Button>
      </Stack>
    </>
  );
}
