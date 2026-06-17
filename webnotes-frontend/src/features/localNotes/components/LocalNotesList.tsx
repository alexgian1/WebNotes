import {
  Box,
  Button,
  InputAdornment,
  IconButton,
  List,
  ListItemIcon,
  ListItemButton,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState, type MouseEvent } from 'react';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import SortRoundedIcon from '@mui/icons-material/SortRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { LocalNote } from '../model/LocalNote';

export type LocalNotesSortMode = 'date' | 'alphabetical';

type LocalNotesListProps = {
  localNotes: LocalNote[];
  totalLocalNotesCount: number;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onClearSearchQuery: () => void;
  sortMode: LocalNotesSortMode;
  onSortModeChange: (sortMode: LocalNotesSortMode) => void;
  selectedLocalNoteId?: string;
  onSelectLocalNote: (localNote: LocalNote) => void;
};

export function LocalNotesList({
  localNotes,
  totalLocalNotesCount,
  searchQuery,
  onSearchQueryChange,
  onClearSearchQuery,
  sortMode,
  onSortModeChange,
  selectedLocalNoteId,
  onSelectLocalNote,
}: LocalNotesListProps) {
  const [sortMenuAnchorElement, setSortMenuAnchorElement] = useState<HTMLElement | null>(null);
  const normalizedSearchQuery = searchQuery.trim();
  const hasSearchQuery = normalizedSearchQuery.length > 0;
  const hasLocalNotes = totalLocalNotesCount > 0;
  const hasNoSearchResults = hasSearchQuery && localNotes.length === 0;
  const isSortMenuOpen = Boolean(sortMenuAnchorElement);

  function openSortMenu(event: MouseEvent<HTMLButtonElement>) {
    setSortMenuAnchorElement(event.currentTarget);
  }

  function closeSortMenu() {
    setSortMenuAnchorElement(null);
  }

  function handleSelectSortMode(nextSortMode: LocalNotesSortMode) {
    onSortModeChange(nextSortMode);
    closeSortMenu();
  }

  return (
    <Stack
      spacing={2}
      sx={{
        width: { xs: '100%', md: 320 },
        maxWidth: '100%',
        flexShrink: 0,
        height: '100%',
        minHeight: 0,
        overflow: 'hidden',
      }}
    >
      <Box sx={{ bgcolor: 'transparent', pt: 0.5, pb: 1, flexShrink: 0 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Tooltip title="Sort" placement="top">
            <IconButton
              onClick={openSortMenu}
              aria-haspopup="menu"
              aria-expanded={isSortMenuOpen}
              aria-controls={isSortMenuOpen ? 'local-notes-sort-menu' : undefined}
              size="small"
              sx={{
                flexShrink: 0,
                width: 36,
                height: 36,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 999,
                bgcolor: 'transparent',
              }}
            >
              <SortRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <TextField
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape' && searchQuery) {
                onClearSearchQuery();
              }
            }}
            placeholder="Search notes"
            fullWidth
            size="small"
            inputProps={{ 'aria-label': 'Search notes' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
              endAdornment: searchQuery ? (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    aria-label="Clear search"
                    onClick={onClearSearchQuery}
                    size="small"
                  >
                    <ClearRoundedIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : undefined,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 999,
                bgcolor: 'transparent',
                transition: 'box-shadow 120ms ease, border-color 120ms ease, background-color 120ms ease',
              },
              '& .MuiOutlinedInput-root:hover': {
                bgcolor: 'transparent',
              },
              '& .MuiOutlinedInput-root.Mui-focused': {
                bgcolor: 'transparent',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'divider',
              },
              '& .MuiOutlinedInput-input': {
                py: 1.1,
              },
            }}
          />
        </Stack>
        <Menu
          id="local-notes-sort-menu"
          anchorEl={sortMenuAnchorElement}
          open={isSortMenuOpen}
          onClose={closeSortMenu}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 216,
              borderRadius: 2,
            },
          }}
        >
          <MenuItem
            selected={sortMode === 'date'}
            onClick={() => handleSelectSortMode('date')}
          >
            <ListItemIcon sx={{ minWidth: 32 }}>
              {sortMode === 'date' ? <CheckRoundedIcon fontSize="small" /> : <SortRoundedIcon fontSize="small" />}
            </ListItemIcon>
            Date
          </MenuItem>
          <MenuItem
            selected={sortMode === 'alphabetical'}
            onClick={() => handleSelectSortMode('alphabetical')}
          >
            <ListItemIcon sx={{ minWidth: 32 }}>
              {sortMode === 'alphabetical' ? <CheckRoundedIcon fontSize="small" /> : <SortRoundedIcon fontSize="small" />}
            </ListItemIcon>
            Alphabetical
          </MenuItem>
        </Menu>
      </Box>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          pr: 0.5,
          scrollbarGutter: 'stable',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255, 255, 255, 0.28) transparent',
          '&::-webkit-scrollbar': {
            width: 10,
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255, 255, 255, 0.22)',
            borderRadius: 999,
            border: '2px solid transparent',
            backgroundClip: 'content-box',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.36)',
          },
        }}
      >
        {!hasLocalNotes ? (
          <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2 }}>
            <Typography color="text.secondary">
              No local notes yet.
            </Typography>
          </Box>
        ) : hasNoSearchResults ? (
          <Box
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              p: 2,
              display: 'grid',
              gap: 1,
            }}
          >
            <Typography fontWeight={600}>
              No matching notes
            </Typography>
            <Typography color="text.secondary">
              No notes match "{normalizedSearchQuery}".
            </Typography>
            <Button
              variant="text"
              size="small"
              onClick={onClearSearchQuery}
              sx={{ justifySelf: 'start', px: 0, minWidth: 0, textTransform: 'none' }}
            >
              Clear search
            </Button>
          </Box>
        ) : (
          <List
            disablePadding
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              overflow: 'hidden',
            }}
          >
            {localNotes.map((localNote) => (
              <ListItemButton
                key={localNote.id}
                selected={localNote.id === selectedLocalNoteId}
                onClick={() => onSelectLocalNote(localNote)}
                sx={{
                  alignItems: 'flex-start',
                  py: 1.5,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  '&:last-of-type': {
                    borderBottom: 0,
                  },
                }}
              >
                <Stack spacing={0.5} sx={{ minWidth: 0 }}>
                  <Typography noWrap fontWeight={600}>
                    {localNote.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(localNote.updatedAt).toLocaleString()}
                  </Typography>
                </Stack>
              </ListItemButton>
            ))}
          </List>
        )}
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', px: 0.5, flexShrink: 0 }}>
        {hasSearchQuery
          ? `Showing ${localNotes.length} of ${totalLocalNotesCount} notes`
          : `${totalLocalNotesCount} note${totalLocalNotesCount === 1 ? '' : 's'}`}
      </Typography>
    </Stack>
  );
}
