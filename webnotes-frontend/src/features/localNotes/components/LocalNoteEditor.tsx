import { useLayoutEffect, useRef, useState } from 'react';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { LocalNoteDraft } from '../model/LocalNoteDraft';

const MIN_EDITOR_HEIGHT = 180;
const EDITOR_HEIGHT_RESERVE = 32;

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
  const shellRef = useRef<HTMLDivElement | null>(null);
  const titleRowRef = useRef<HTMLDivElement | null>(null);
  const actionsRowRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<ReactQuill | null>(null);
  const [editorHeight, setEditorHeight] = useState(MIN_EDITOR_HEIGHT);

  useLayoutEffect(() => {
    const resizeEditor = () => {
      const shellHeight = shellRef.current?.clientHeight ?? 0;
      const titleHeight = titleRowRef.current?.offsetHeight ?? 0;
      const actionsHeight = actionsRowRef.current?.offsetHeight ?? 0;
      const gapSpace = 16 * 2;
      const availableHeight = shellHeight > 0
        ? Math.max(MIN_EDITOR_HEIGHT, shellHeight - titleHeight - actionsHeight - gapSpace - EDITOR_HEIGHT_RESERVE)
        : MIN_EDITOR_HEIGHT;
      const contentHeight = quillRef.current?.getEditor().root.scrollHeight ?? MIN_EDITOR_HEIGHT;
      const nextHeight = Math.min(Math.max(contentHeight, MIN_EDITOR_HEIGHT), availableHeight);

      setEditorHeight(nextHeight);
    };

    resizeEditor();

    const observer = new ResizeObserver(() => {
      resizeEditor();
    });

    if (shellRef.current) {
      observer.observe(shellRef.current);
    }

    window.addEventListener('resize', resizeEditor);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', resizeEditor);
    };
  }, [draft?.title, draft?.content]);

  if (!draft) {
    return (
      <Box
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          p: 3,
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Typography color="text.secondary">
          Create a local note to start writing.
        </Typography>
      </Box>
    );
  }

  return (
    <Box ref={shellRef} sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <Box ref={titleRowRef}>
        <TextField
          label="Title"
          value={draft.title}
          onChange={(event) => onTitleChange(event.target.value)}
          fullWidth
        />
      </Box>
      <Box sx={{ mt: 2, height: editorHeight, minHeight: MIN_EDITOR_HEIGHT, flexShrink: 0 }}>
        <ReactQuill
          ref={quillRef}
          className="local-note-editor"
          theme="snow"
          value={draft.content}
          onChange={onContentChange}
        />
      </Box>
      <Stack
        ref={actionsRowRef}
        direction="row"
        spacing={1}
        sx={{ pt: 2, borderTop: '1px solid', borderColor: 'divider', flexShrink: 0 }}
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
    </Box>
  );
}
