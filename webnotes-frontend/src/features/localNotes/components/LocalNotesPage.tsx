import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Drawer,
  IconButton,
  Fab,
  Snackbar,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { DeleteLocalNoteDialog } from './DeleteLocalNoteDialog';
import { LocalNoteEditor } from './LocalNoteEditor';
import { LocalNotesList } from './LocalNotesList';
import { UnsavedChangesDialog } from './UnsavedChangesDialog';
import { LocalNote } from '../model/LocalNote';
import { useLocalNotesWorkspace } from '../hooks/useLocalNotesWorkspace';

export function LocalNotesPage() {
  const workspace = useLocalNotesWorkspace();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isNotesDrawerOpen, setIsNotesDrawerOpen] = useState(false);

  useEffect(() => {
    if (!isMobile) {
      setIsNotesDrawerOpen(false);
    }
  }, [isMobile]);

  function openNotesDrawer() {
    setIsNotesDrawerOpen(true);
  }

  function closeNotesDrawer() {
    setIsNotesDrawerOpen(false);
  }

  function handleCreateLocalNote() {
    workspace.requestCreateLocalNote();

    if (isMobile) {
      setIsNotesDrawerOpen(false);
    }
  }

  function handleSelectLocalNote(localNote: LocalNote) {
    workspace.selectLocalNote(localNote);

    if (isMobile) {
      setIsNotesDrawerOpen(false);
    }
  }

  const notesList = (
    <LocalNotesList
      localNotes={workspace.localNotes}
      selectedLocalNoteId={workspace.draft?.id}
      onSelectLocalNote={handleSelectLocalNote}
    />
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
          <IconButton
            aria-label="Open notes menu"
            onClick={openNotesDrawer}
            color="inherit"
            sx={{ display: { xs: 'inline-flex', md: 'none' }, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
          >
            <Box sx={{ display: 'grid', gap: 0.4 }}>
              <Box sx={{ width: 18, height: 2, bgcolor: 'currentColor', borderRadius: 1 }} />
              <Box sx={{ width: 18, height: 2, bgcolor: 'currentColor', borderRadius: 1 }} />
              <Box sx={{ width: 18, height: 2, bgcolor: 'currentColor', borderRadius: 1 }} />
            </Box>
          </IconButton>
          <Typography variant="h6" component="h1" noWrap>
            Local Notes
          </Typography>
        </Box>
      </Box>

      <Stack direction="row" spacing={3} sx={{ alignItems: 'flex-start' }}>
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>{notesList}</Box>

        <Stack spacing={2} sx={{ flex: 1, minWidth: 0 }}>
          <LocalNoteEditor
            draft={workspace.draft}
            isDirty={workspace.isDirty}
            isPersisted={workspace.isPersisted}
            onTitleChange={workspace.updateDraftTitle}
            onContentChange={workspace.updateDraftContent}
            onSave={workspace.handleSaveLocalNote}
            onDelete={workspace.openDeleteDialog}
          />
        </Stack>
      </Stack>

      <Drawer
        open={isNotesDrawerOpen}
        onClose={closeNotesDrawer}
        ModalProps={{ keepMounted: true }}
        PaperProps={{ sx: { width: 'min(100vw, 360px)', p: 2 } }}
      >
        {notesList}
      </Drawer>

      <Fab
        variant="extended"
        onClick={handleCreateLocalNote}
        aria-label="Create new note"
        sx={{
          position: 'fixed',
          right: { xs: 16, md: 24 },
          bottom: { xs: 16, md: 24 },
          zIndex: (theme) => theme.zIndex.speedDial,
          textTransform: 'none',
        }}
      >
        +
        New
      </Fab>

      <DeleteLocalNoteDialog
        isOpen={workspace.isDeleteDialogOpen}
        onClose={workspace.closeDeleteDialog}
        onDelete={workspace.handleDeleteLocalNote}
      />
      <UnsavedChangesDialog
        isOpen={workspace.isUnsavedChangesDialogOpen}
        onStay={workspace.stayOnCurrentLocalNote}
        onDiscardAndExit={workspace.discardAndExitLocalNote}
        onSaveAndExit={workspace.saveAndExitLocalNote}
      />
      <Snackbar
        open={Boolean(workspace.notification)}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        onClose={workspace.closeNotification}
      >
        <Alert
          severity={workspace.notification?.severity ?? 'success'}
          variant="filled"
          onClose={workspace.closeNotification}
        >
          {workspace.notification?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
