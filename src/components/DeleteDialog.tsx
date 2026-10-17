import { useState } from "react";
import Dialog from "./Dialog";

import styles from "./Dialog.module.css";

/**
 * Builds the tab items client-side so JSX content doesn't have to be
 * serialized across the Astro island boundary.
 */
const DeleteDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  return (
    <section className="inline-bumper" aria-labelledby="dialog-heading">
      <header className="container">
        <h2 id="dialog-heading">Dialog</h2>
      </header>
      <div className="container">
        <button
          className="button"
          type="button"
          onClick={() => setDialogOpen(true)}
        >
          Delete project
        </button>
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          title="Delete project?"
          description="This permanently removes the project and its history."
          styles={styles}
        >
          <div className={styles.actions}>
            <button
              className="button"
              type="button"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </button>
            <button
              className="button danger"
              type="button"
              onClick={() => setDialogOpen(false)}
            >
              Delete
            </button>
          </div>
        </Dialog>
      </div>
    </section>
  );
};

export default DeleteDialog;
