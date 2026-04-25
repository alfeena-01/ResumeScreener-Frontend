"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchNotifications, Notification } from "@/service/api";
import styles from "./notificationBadge.module.css";

export default function NotificationBadge() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const notifications = await fetchNotifications();
        const unread = notifications.filter((n: Notification) => !n.is_read).length;
        setUnreadCount(unread);
      } catch (err) {
        console.error("Error loading notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Link href="/dashboard/notifications">
      <div className={styles.badge}>
        <span className={styles.icon}>🔔</span>
        {unreadCount > 0 && <span className={styles.count}>{unreadCount}</span>}
      </div>
    </Link>
  );
}
