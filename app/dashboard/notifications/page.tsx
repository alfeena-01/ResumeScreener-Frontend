"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import NotificationsComponent from "./NotificationsComponent";

export default function NotificationsPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated and has correct role
    const userType = localStorage.getItem("user_type");
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken || userType !== "job_seeker") {
      router.push("/auth/login");
      return;
    }
  }, [router]);

  return (
    <div>
      <NotificationsComponent />
    </div>
  );
}
