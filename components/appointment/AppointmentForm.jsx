"use client";
import { useForm } from "react-hook-form";
import styles from "./AppointmentForm.module.css";
import { createAppointment } from "@/lib/actions/createAppointment";
import { useRouter, useSearchParams } from "next/navigation";
import { doctors } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getPatientById } from "@/lib/actions/createUser";
import { useState } from "react";

function AppointmentForm() {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const patientID = searchParams.get("patientID");
  const { register, handleSubmit } = useForm();
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ["patient_info"],
    queryFn: () => getPatientById(patientID),
  });

  if (isLoading) {
    return <div>Loading patient information...</div>;
  }

  if (error) {
    return <div>Error loading patient information: {error.message}</div>;
  }

  async function onSubmit(e) {
    setLoading(true);
    try {
      const newAppointment = await createAppointment({
        ...e,
        patient: data?.fullName,
        patientId: patientID,
      });
      router.push(`/appointment/success?appointmentId=${newAppointment.$id}`);
    } catch (error) {
      console.error("Error creating appointment:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.form_container}>
      <form
        className={styles.appointment_form}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className={styles.form_row}>
          <div className={styles.form_col}>
            <label htmlFor="doctor">Doctor</label>
            <select {...register("doctor")} id="doctor">
              {doctors.map((doctor) => (
                <option value={doctor.name} key={doctor.name}>
                  Dr.{doctor?.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className={styles.form_row__2}>
          <div className={styles.form_col}>
            <label htmlFor="reason">Reason for appointment </label>
            <textarea
              {...register("reason")}
              id="reason"
              placeholder="ex: Annual monthly check-up"
            ></textarea>
          </div>
          <div className={styles.form_col}>
            <label htmlFor="comment">Additional comments/notes</label>
            <textarea
              {...register("comment")}
              id="comment"
              placeholder="ex: Prefer afternoon appointments, if possible"
            ></textarea>
          </div>
        </div>
        <div className={styles.form_row}>
          <div className={styles.form_col}>
            <label htmlFor="date">Expected appointment date</label>
            <input
              type="date"
              {...register("date")}
              id="date"
              min={new Date().toISOString().split("T")[0]}
            />
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

export default AppointmentForm;
