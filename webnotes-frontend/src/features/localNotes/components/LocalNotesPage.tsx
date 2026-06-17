import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Drawer,
  IconButton,
  Fab,
  Snackbar,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { DeleteLocalNoteDialog } from './DeleteLocalNoteDialog';
import { LocalNoteEditor } from './LocalNoteEditor';
import { LocalNotesList } from './LocalNotesList';
import { UnsavedChangesDialog } from './UnsavedChangesDialog';
import { LocalNote } from '../model/LocalNote';
import { useLocalNotesWorkspace } from '../hooks/useLocalNotesWorkspace';
import { useLocalNotesSearch } from '../hooks/useLocalNotesSearch';
import { LocalNotesSortMode } from './LocalNotesList';

export function LocalNotesPage() {
  const workspace = useLocalNotesWorkspace();
  const search = useLocalNotesSearch(workspace.localNotes);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isNotesDrawerOpen, setIsNotesDrawerOpen] = useState(false);
  const [sortMode, setSortMode] = useState<LocalNotesSortMode>('date');

  const visibleLocalNotes = useMemo(() => {
    return sortLocalNotes(search.filteredLocalNotes, sortMode);
  }, [search.filteredLocalNotes, sortMode]);

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
      localNotes={visibleLocalNotes}
      totalLocalNotesCount={search.totalLocalNotesCount}
      searchQuery={search.searchQuery}
      onSearchQueryChange={search.setSearchQuery}
      onClearSearchQuery={search.clearSearchQuery}
      sortMode={sortMode}
      onSortModeChange={setSortMode}
      selectedLocalNoteId={workspace.draft?.id}
      onSelectLocalNote={handleSelectLocalNote}
    />
  );

  return (
    <Box
      sx={{
        height: '100dvh',
        bgcolor: 'background.default',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          alignItems: 'center',
          px: 2,
          pt: 2,
          pb: 1,
          flexShrink: 0,
        }}
      >
        <IconButton
          aria-label="Open notes menu"
          onClick={openNotesDrawer}
          color="inherit"
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            bgcolor: 'background.default',
          }}
        >
          <Box sx={{ display: 'grid', gap: 0.4 }}>
            <Box sx={{ width: 18, height: 2, bgcolor: 'currentColor', borderRadius: 1 }} />
            <Box sx={{ width: 18, height: 2, bgcolor: 'currentColor', borderRadius: 1 }} />
            <Box sx={{ width: 18, height: 2, bgcolor: 'currentColor', borderRadius: 1 }} />
          </Box>
        </IconButton>
      </Box>

      <Stack
        direction="row"
        spacing={3}
        sx={{
          alignItems: 'stretch',
          flex: 1,
          minHeight: 0,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            display: { xs: 'none', md: 'block' },
            alignSelf: 'stretch',
            height: '100%',
            minHeight: 0,
            pl: 3,
            pt: 3,
            pb: 3,
          }}
        >
          {notesList}
        </Box>

        <Stack
          spacing={2}
          sx={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            pt: { xs: 1, md: 2 },
            pr: { xs: 2, md: 3 },
            overflow: 'visible',
          }}
        >
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
        PaperProps={{
          sx: {
            width: 'min(100vw, 360px)',
            height: '100dvh',
            boxSizing: 'border-box',
            overflow: 'hidden',
          },
        }}
      >
        <Box sx={{ p: 2, height: '100%', boxSizing: 'border-box' }}>{notesList}</Box>
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

function sortLocalNotes(localNotes: LocalNote[], sortMode: LocalNotesSortMode) {
  return [...localNotes].sort((left, right) => {
    if (sortMode === 'alphabetical') {
      const titleComparison = left.title.localeCompare(right.title, undefined, {
        sensitivity: 'base',
      });

      if (titleComparison !== 0) {
        return titleComparison;
      }
    }

    return right.updatedAt.localeCompare(left.updatedAt);
  });
}
