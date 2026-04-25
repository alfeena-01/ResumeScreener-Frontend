"use client";

import { useState, useEffect } from "react";
import { fetchNotifications, markNotificationAsRead, deleteNotification, Notification } from "@/service/api";
import styles from "./notifications.module.css";

export default function NotificationsComponent() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await fetchNotifications();
      setNotifications(data);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load notifications";
      setError(errorMessage);
      console.error("Error loading notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(
        notifications.map((n) =>
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const handleDelete = async (notificationId: number) => {
    try {
      await deleteNotification(notificationId);
      setNotifications(notifications.filter((n) => n.id !== notificationId));
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  if (loading) {
    return <div className={styles.container}><p>Loading notifications...</p></div>;
  }

  if (error) {
    return <div className={styles.container}><p className={styles.error}>{error}</p></div>;
  }

  if (notifications.length === 0) {
    return <div className={styles.container}><p className={styles.empty}>No notifications yet</p></div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Your Notifications</h2>
      <div className={styles.notificationsList}>
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`${styles.notificationCard} ${notification.is_read ? styles.read : styles.unread}`}
          >
            <div className={styles.notificationHeader}>
              <h3 className={styles.notificationTitle}>{notification.title}</h3>
              <span className={styles.notificationTime}>
                {new Date(notification.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className={styles.notificationMessage}>{notification.message}</p>
            {notification.company_name && (
              <p className={styles.companyInfo}>
                <strong>Company:</strong> {notification.company_name}
              </p>
            )}
            <div className={styles.notificationActions}>
              {!notification.is_read && (
                <button
                  className={styles.markReadBtn}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  Mark as Read
                </button>
              )}
              <button
                className={styles.deleteBtn}
                onClick={() => handleDelete(notification.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
