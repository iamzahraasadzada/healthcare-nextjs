"use client";
import styles from "./PasskeyModal.module.css";
import PasskeyInput from "./PasskeyInput";
import { IoClose } from "react-icons/io5";
import { store } from "@/Store";

function PasskeyModal() {
  const toggleModal = store((state) => state.toggleModal);

  function handleClick() {
    toggleModal(false);
  }
  return (
    <div className={styles.passkey_modal__container}>
      <div className={styles.overlay} />
      <div className={styles.container}>
        <div className={styles.passkey_modal}>
          <div className={styles.row}>
            <div className={styles.col2}>
              <h2>Access Verification</h2>
              <IoClose
                className={styles.close_button}
                onClick={() => handleClick()}
              />
            </div>
            <div className={styles.col}>
              <p>To access the admin page, please enter the passkey.....</p>
            </div>
          </div>
          <PasskeyInput />
        </div>
      </div>
    </div>
  );
}

export default PasskeyModal;
