"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { AppointmentFormWrapper } from "@/components/appointment/AppointmentForm";
import Logo from "@/ui/Logo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function Page() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 0,
      },
    },
  });

  return (
    <div className={styles.appointment}>
      <div className={styles.appointment_container}>
        <div className={styles.left_side}>
          <div className={styles.logo}>
            <Logo />
          </div>
          <div className={styles.header}>
            <h1>Hey there 👋</h1>
            <p>Request a new appointment in 10 seconds</p>
          </div>
          <QueryClientProvider client={queryClient}>
            <AppointmentFormWrapper />
          </QueryClientProvider>
        </div>
        <div className={styles.right_side}>
          <Image
            src="/assets/images/appointment-img.png"
            height={1500}
            width={1500}
            alt="patient"
            className={styles.side_img}
            quality={100}
            priority
          />
        </div>
      </div>
    </div>
  );
}

export default Page;
