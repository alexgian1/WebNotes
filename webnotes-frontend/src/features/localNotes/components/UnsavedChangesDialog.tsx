import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

type UnsavedChangesDialogProps = {
  isOpen: boolean;
  onStay: () => void;
  onDiscardAndExit: () => void;
  onSaveAndExit: () => void;
};

export function UnsavedChangesDialog({
  isOpen,
  onStay,
  onDiscardAndExit,
  onSaveAndExit,
}: UnsavedChangesDialogProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={onStay}
      aria-labelledby="unsaved-local-note-dialog-title"
      aria-describedby="unsaved-local-note-dialog-description"
    >
      <DialogTitle id="unsaved-local-note-dialog-title">
        Unsaved changes
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="unsaved-local-note-dialog-description">
          This local note has unsaved changes. Save before leaving, discard the changes, or stay on this note.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onStay}>
          Stay
        </Button>
        <Button color="warning" onClick={onDiscardAndExit}>
          Discard & Exit
        </Button>
        <Button variant="contained" onClick={onSaveAndExit}>
          Save & Exit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
