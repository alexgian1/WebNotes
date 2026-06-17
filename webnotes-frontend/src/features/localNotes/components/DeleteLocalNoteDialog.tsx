import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

type DeleteLocalNoteDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
};

export function DeleteLocalNoteDialog({
  isOpen,
  onClose,
  onDelete,
}: DeleteLocalNoteDialogProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="delete-local-note-dialog-title"
      aria-describedby="delete-local-note-dialog-description"
    >
      <DialogTitle id="delete-local-note-dialog-title">
        Delete local note?
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-local-note-dialog-description">
          This note will be removed from local storage.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button color="error" variant="contained" onClick={onDelete}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
