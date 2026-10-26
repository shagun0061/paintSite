import { useState } from 'react';
import { Button } from '../ui/Button.jsx';
import { Modal } from '../ui/Modal.jsx';

/**
 * Button that asks for confirmation before running `onConfirm`.
 * Usage: <ConfirmButton title="Delete project?" message="…" onConfirm={fn}>Delete</ConfirmButton>
 */
export function ConfirmButton({ title, message, confirmLabel = 'Delete', onConfirm, children, ...buttonProps }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function confirm() {
    setBusy(true);
    try {
      await onConfirm();
      setOpen(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Button {...buttonProps} onClick={() => setOpen(true)}>
        {children}
      </Button>
      <Modal open={open} onClose={() => !busy && setOpen(false)} title={title} className="max-w-md">
        <div className="p-5">
          <p className="text-navy-700">{message}</p>
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={busy}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirm} loading={busy}>
              {confirmLabel}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
