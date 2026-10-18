import { useEffect, useId, useRef, type ReactNode } from "react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  styles?: { dialog?: string; body?: string; title?: string; close?: string };
}

/**
 * Modal dialog built on the native <dialog> element.
 * https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
 *
 * showModal() gives us the hard parts for free: the rest of the page becomes
 * inert (no focus trap code, no aria-hidden juggling), the dialog renders in
 * the top layer, and Escape fires a `cancel` event. We add:
 * - an accessible name and description,
 * - focus on the first focusable element (or the dialog itself),
 * - focus returned to whatever opened it,
 * - closing on a backdrop click.
 */
const Dialog = ({
  open,
  onClose,
  title,
  description,
  children,
  styles,
}: DialogProps) => {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const returnFocusTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      returnFocusTo.current = document.activeElement as HTMLElement | null;
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
      returnFocusTo.current?.focus();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      className={styles?.dialog}
      onCancel={(event) => {
        // Keep React state as the source of truth instead of letting the
        // browser close the dialog behind our back.
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        // Clicks on the ::backdrop are reported with the dialog as target.
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={styles?.body}>
        <h2 id={titleId} className={styles?.title}>
          {title}
        </h2>
        {description && <p id={descriptionId}>{description}</p>}
        {children}
        <button
          type="button"
          className={`button ${styles?.close}`}
          aria-label="Close"
          onClick={onClose}
        >
          ×
        </button>
      </div>
    </dialog>
  );
};

export default Dialog;
