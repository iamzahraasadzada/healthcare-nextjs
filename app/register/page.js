import Image from "next/image";
import styles from "./page.module.css";
import RegisterForm from "@/components/register/RegisterForm";
import Logo from "@/ui/Logo";

function page({ searchParams }) {
  return (
    <div className={styles.register}>
      <div className={styles.register_container}>
        <div className={styles.left_side}>
          <div className={styles.logo}>
            <Logo />
          </div>
          <div className={styles.header}>
            <h1>Welcome 👋</h1>
            <p>Let us know more about yourself</p>
          </div>
          <RegisterForm userId={searchParams.userId} />
        </div>
        <div className={styles.right_side}>
          <Image
            src="/assets/images/register-img.png"
            height={780}
            width={390}
            alt="patinet"
            className={styles.side_img}
            quality={90}
          />
        </div>
      </div>
    </div>
  );
}

export default page;
