import { Alert, Box, Snackbar, Stack } from '@mui/material';
import { DeleteLocalNoteDialog } from './DeleteLocalNoteDialog';
import { LocalNoteEditor } from './LocalNoteEditor';
import { LocalNotesList } from './LocalNotesList';
import { UnsavedChangesDialog } from './UnsavedChangesDialog';
import { useLocalNotesWorkspace } from '../hooks/useLocalNotesWorkspace';

export function LocalNotesPage() {
  const workspace = useLocalNotesWorkspace();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ p: 3 }}>
        <LocalNotesList
          localNotes={workspace.localNotes}
          selectedLocalNoteId={workspace.draft?.id}
          onCreateLocalNote={workspace.requestCreateLocalNote}
          onSelectLocalNote={workspace.selectLocalNote}
        />

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
