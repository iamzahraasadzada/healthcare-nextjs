"use client";
import Logo from "@/ui/Logo";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminTable from "@/components/admin/AdminTable";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TotalContainer from "@/components/admin/TotalContainer";
import LoadingFullpage from "@/ui/LoadingFullpage";
import { store } from "@/Store";

function Admin() {
  const [loading, setLoading] = useState(true);

  const { isModalOpened } = store((state) => ({
    isModalOpened: state.isModalOpened,
  }));

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 0,
      },
    },
  });
  const router = useRouter();

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }

      try {
        const res = await fetch("/api/verify-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();
        if (data.valid) {
          setLoading(false);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error during token validation:", error);
        router.push("/");
      }
    };

    validateToken();
  }, [router]);

  if (loading) return <LoadingFullpage />;

  return (
    <div
      className={`${styles.admin_page} ${
        isModalOpened ? styles.stop_scroll : ""
      }`}
    >
      <div className={styles.header}>
        <Logo />
      </div>
      <div className={styles.container}>
        <div className={styles.header_text}>
          <h1>Welcome, Admin</h1>
          <p>Start day with managing new appointments</p>
        </div>

        <QueryClientProvider client={queryClient}>
          <TotalContainer />
          <AdminTable />
        </QueryClientProvider>
      </div>
    </div>
  );
}

export default Admin;
