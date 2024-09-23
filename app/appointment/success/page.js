import Logo from "@/ui/Logo";
import styles from "./page.module.css";
import Image from "next/image";
import { LuCalendarDays } from "react-icons/lu";
import { getAppointmentById } from "@/lib/actions/createAppointment";
import { convertDate } from "@/lib/utils";

async function page({ searchParams }) {
  const res = await getAppointmentById(searchParams.appointmentId);

  const date = convertDate(res.date);

  return (
    <div className={styles.success_page}>
      <div className={styles.container}>
        <div className={styles.logo_container}>
          <Logo />
        </div>
        <div className={styles.succes_container}>
          <div className={styles.col}>
            <div className={styles.icon_box}>
              <Image
                src="/assets/gifs/success.gif"
                height={200}
                width={180}
                alt="success"
                priority
              />
            </div>
            <h1 className={styles.header}>
              Your <span>appointment request</span> has been successfully
              submitted!
            </h1>
            <p className={styles.subtext}></p>
          </div>
          <div className={styles.row}>
            <p className={styles.subtext_detail}>
              Requested appointment details:
            </p>
            <div className={styles.doctor}>
              <Image
                src="/assets/images/dr-peter.png"
                height={28}
                width={28}
                alt="doctor"
                quality={90}
              />
              <p>Dr.{res?.doctor}</p>
            </div>
            <div className={styles.date}>
              <LuCalendarDays />
              <p>{date}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
