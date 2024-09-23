"use client";
import { store } from "@/Store";
import styles from "./AdminButton.module.css";

function AdminButton() {
  const toggleModal = store((state) => state.toggleModal);

  function handleClick() {
    toggleModal(true);
  }

  return (
    <div className={styles.admin_btn} onClick={() => handleClick()}>
      Admin
    </div>
  );
}

export default AdminButton;
