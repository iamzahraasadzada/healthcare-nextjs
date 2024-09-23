"use client";
import { useForm } from "react-hook-form";
import styles from "./RegisterForm.module.css";
import { useRouter } from "next/navigation";
import { createPatient } from "@/lib/actions/createUser";
import { useState } from "react";

function RegisterForm({ userId }) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm();
  const router = useRouter();

  const { fullName, email, phoneNumber } = JSON.parse(
    localStorage.getItem("firstData")
  );

  async function onSubmit(e) {
    setLoading(true);
    const newPatient = await createPatient({ ...e, userId: userId });

    router.push(`/appointment?patientID=${newPatient.$id}`);
  }

  return (
    <div className={styles.register_form__container}>
      <div className={styles.form_header}>
        <h2>Personal Information</h2>
      </div>
      <form className={styles.register_form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.form_row}>
          <div className={styles.form_col}>
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              {...register("fullName")}
              id="fullName"
              defaultValue={fullName}
            />
          </div>
        </div>
        <div className={styles.form_row__2}>
          <div className={styles.form_col}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              {...register("email")}
              id="email"
              defaultValue={email}
            />
          </div>
          <div className={styles.form_col}>
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="tel"
              {...register("number")}
              id="phoneNumber"
              defaultValue={phoneNumber}
            />
          </div>
        </div>
        <div className={styles.form_row__2}>
          <div className={styles.form_col}>
            <label htmlFor="birthDate">Date of Birth</label>
            <input type="date" {...register("birthdate")} id="birthDate" />
          </div>
          <div className={styles.form_col}>
            <p>Insurance policy number</p>
            <div className={styles.check_col}>
              <div className={styles.checkbox}>
                <input
                  type="radio"
                  {...register("gender")}
                  value="male"
                  id="male"
                />
                <label htmlFor="male">Male</label>
              </div>
              <div className={styles.checkbox}>
                <input
                  type="radio"
                  {...register("gender")}
                  value="female"
                  id="female"
                />
                <label htmlFor="female">Female</label>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.form_row__2}>
          <div className={styles.form_col}>
            <label htmlFor="address">Address</label>
            <input type="text" {...register("address")} id="address" />
          </div>
          <div className={styles.form_col}>
            <label htmlFor="occupation">Occupation</label>
            <input type="text" {...register("occupation")} id="occupation" />
          </div>
        </div>
        <div className={styles.form_row__2}>
          <div className={styles.form_col}>
            <label htmlFor="allergies">Allergies (if any)</label>
            <textarea {...register("allergies")} id="allergies"></textarea>
          </div>
          <div className={styles.form_col}>
            <label htmlFor="famMedical">Family medical history</label>
            <textarea {...register("famMedical")} id="famMedical"></textarea>
          </div>
        </div>
        <div className={styles.form_row__2}>
          <div className={styles.form_col}>
            <label htmlFor="pastMedical">Past medical history</label>
            <textarea {...register("pastMedical")} id="pastMedical"></textarea>
          </div>
          <div className={styles.form_col}>
            <label htmlFor="curMedical">Current medications</label>
            <textarea {...register("curMedical")} id="curMedical"></textarea>
          </div>
        </div>
        <input
          className={`${loading && styles.loading_btn} ${styles.button}`}
          type="submit"
          disabled={loading}
          value={loading ? "...Loading" : "Submit and Continue"}
        />
      </form>
    </div>
  );
}

export default RegisterForm;
