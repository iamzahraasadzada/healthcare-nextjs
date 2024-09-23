"use client";
import Image from "next/image";
import styles from "./page.module.css";
import PatinetForm from "@/components/home/PatinetForm";
import AdminButton from "@/components/admin/AdminButton";
import Logo from "@/ui/Logo";
import PasskeyModal from "@/ui/PasskeyModal";
import { store } from "@/Store";

export default function Home() {
  const isOpened = store((state) => state.isOpen);

  return (
    <>
      <div className={styles.home}>
        <div className={styles.container}>
          <div className={styles.left_side}>
            <div className={styles.left_side__container}>
              <Logo />
              <PatinetForm />
              <AdminButton />
            </div>
          </div>
          <div className={styles.right_side}>
            <Image
              src="/assets/images/onboarding-img.png"
              height={1000}
              width={1000}
              alt="patinet"
              className={styles.side_img}
              quality={90}
            />
          </div>
        </div>
      </div>
      {isOpened ? <PasskeyModal /> : null}
    </>
  );
}
