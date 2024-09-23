"use client";
import { useForm } from "react-hook-form";
import { IoPersonOutline } from "react-icons/io5";
import { TfiEmail } from "react-icons/tfi";
import { FiPhone } from "react-icons/fi";
import styles from "./PatinetForm.module.css";
import { store } from "@/Store";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions/createUser";
import { useState } from "react";

function PatinetForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register, handleSubmit } = useForm();
  const setData = store((state) => state.setFirstData);

  async function onSubmit(e) {
    setLoading(true);
    const userData = {
      ...e,
      phoneNumber: e.phoneNumber.replace(/\s+/g, ""),
    };
    const newUser = await createUser(userData);
    setData(e);
    router.push(`/register?userId=${newUser?.$id}`);
  }

  return (
    <div className={styles.form_container}>
      <div className={styles.form_header}>
        <h1>Hi there...</h1>
        <p>Get Started with Appointments.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.patient_form}>
        <div className={styles.form_row}>
          <label htmlFor="fullName">Full name</label>
          <input
            placeholder=""
            type="text"
            {...register("fullName")}
            id="fullName"
          />
          <IoPersonOutline className={styles.icon_pr} />
        </div>
        <div className={styles.form_row}>
          <label htmlFor="email">Email adress</label>
          <input type="email" {...register("email")} id="email" />
          <TfiEmail className={styles.icon_pe} />
        </div>
        <div className={styles.form_row}>
          <label htmlFor="phoneNumber">Phone number</label>
          <span className={styles.num_span}>Format: +994 XX XXX XX XX</span>
          <input type="tel" {...register("phoneNumber")} id="phoneNumber" />
          <FiPhone className={styles.icon_ph} />
        </div>
        <input
          className={`${loading && styles.loading_btn} ${styles.button}`}
          type="submit"
          disabled={loading}
          value={loading ? "...Loading" : "Get Started"}
        />
      </form>
    </div>
  );
}

export default PatinetForm;
