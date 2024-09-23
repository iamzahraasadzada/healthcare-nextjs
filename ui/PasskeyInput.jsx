"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./PasskeyInput.module.css";
import { useRouter } from "next/navigation";
import { store } from "@/Store";

function PasskeyInput() {
  const inputRefs = useRef([]);
  const [otpValues, setOtpValues] = useState(new Array(6).fill(""));
  const router = useRouter();
  const toggleModal = store((state) => state.toggleModal);

  useEffect(() => {
    const otpInputs = inputRefs.current;

    otpInputs.forEach((input, index) => {
      const handleInput = (event) => {
        const value = event.target.value;
        if (value.length === 1) {
          setOtpValues((prev) => {
            const newValues = [...prev];
            newValues[index] = value;
            return newValues;
          });
          if (index < otpInputs.length - 1) {
            otpInputs[index + 1].focus();
          }
        }
      };

      const handleKeyDown = (event) => {
        if (event.key === "Backspace" && event.target.value === "") {
          setOtpValues((prev) => {
            const newValues = [...prev];
            newValues[index] = "";
            return newValues;
          });
          if (index > 0) {
            otpInputs[index - 1].focus();
          }
        }
      };

      input.addEventListener("input", handleInput);
      input.addEventListener("keydown", handleKeyDown);

      return () => {
        input.removeEventListener("input", handleInput);
        input.removeEventListener("keydown", handleKeyDown);
      };
    });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const passkey = otpValues.join("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ passkey }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        router.push("/admin");
        toggleModal(false);
      } else {
        setError("Yanlış passkey!");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      setError("Bir xəta baş verdi. Zəhmət olmasa, yenidən cəhd edin.");
    }
  };

  return (
    <form className={styles.passkey_form} onSubmit={handleSubmit}>
      <div className={styles.input_container}>
        {[...Array(6)].map((_, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            className={styles.passkey_input}
            ref={(el) => (inputRefs.current[index] = el)}
            value={otpValues[index]}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                setOtpValues((prev) => {
                  const newValues = [...prev];
                  newValues[index] = value;
                  return newValues;
                });
              }
            }}
          />
        ))}
      </div>
      <button type="submit" className={styles.passkey_button}>
        Enter admin panel
      </button>
    </form>
  );
}

export default PasskeyInput;
