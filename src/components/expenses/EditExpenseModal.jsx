"use client";

import EditExpense from "./EditExpense";
import styles from "./EditExpenseModal.module.css";

export default function EditExpenseModal({ expense }) {
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContainer}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h1 className={styles.modalTitle}>Edit Expense</h1>
            <p className={styles.modalSubtitle}>Update your expense details below</p>
          </div>
          <EditExpense expense={expense} />
        </div>
      </div>
    </div>
  );
}