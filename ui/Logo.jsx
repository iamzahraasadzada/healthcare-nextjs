import Image from "next/image";
import Link from "next/link";

function Logo() {
  return (
    <Link href="/">
      <Image
        src="/assets/icons/logo-full.svg"
        height={40}
        width={120}
        alt="patient"
      />
    </Link>
  );
}

export default Logo;
