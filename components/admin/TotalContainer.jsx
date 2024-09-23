import Image from "next/image";
import styles from "./TotalContainer.module.css";
import { useQuery } from "@tanstack/react-query";
import { getAppointment } from "@/lib/actions/createAppointment";
import { getDoctor } from "@/lib/actions/doctorActions";
import { useEffect, useState } from "react";

function TotalContainer() {
  const { data: pending } = useQuery({
    queryKey: ["appointments"],
    queryFn: getAppointment,
  });
  const [accepted, setAccapted] = useState(0);
  const [cancled, setCancled] = useState(0);

  const { data: doctorData } = useQuery({
    queryKey: ["doctor_data"],
    queryFn: getDoctor,
  });
  useEffect(() => {
    const scheduledAppointment = doctorData?.documents.filter(
      (d) => d.status === "Scheduled"
    )?.length;
    if (scheduledAppointment) setAccapted(scheduledAppointment);

    const cancledAppointment = doctorData?.documents.filter(
      (d) => d.status === "Canceled"
    )?.length;
    if (cancledAppointment) setCancled(cancledAppointment);
  }, [doctorData?.documents]);

  return (
    <div className={styles.total_container}>
      <div className={styles.total_box__yellow}>
        <div className={styles.number_row}>
          <Image
            src="/assets/icons/appointments.svg"
            height={24}
            width={24}
            alt="patient"
          />
          <p className={styles.number}>{accepted}</p>
        </div>
        <p className={styles.subtext}>Total number of scheduled appointments</p>
      </div>
      <div className={styles.total_box__blue}>
        <div className={styles.number_row}>
          <Image
            src="/assets/icons/pending.svg"
            height={24}
            width={24}
            alt="patient"
          />
          <p className={styles.number}>
            {+pending?.total - (+accepted + +cancled) || 0}
          </p>
        </div>
        <p className={styles.subtext}>Total number of pending appointments</p>
      </div>
      <div className={styles.total_box__red}>
        <div className={styles.number_row}>
          <Image
            src="/assets/icons/cancelled.svg"
            height={24}
            width={24}
            alt="patient"
          />
          <p className={styles.number}>{cancled}</p>
        </div>
        <p className={styles.subtext}>Total number of cancelled appointments</p>
      </div>
    </div>
  );
}

export default TotalContainer;
