/* src/components/layout/Header/Notification/NotificationBell.jsx */

"use client";

import { useRef, useState } from "react";
import { Bell } from "lucide-react";
import { AnimatePresence } from "framer-motion";

import notifications from "./notifications.json";
import NotificationDropdown from "./NotificationDropdown";
import styles from "./notification.module.css";

export default function NotificationBell({ onItemClick, onViewAll }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  return (
    <div className={styles.wrapper}>
      <button
        ref={triggerRef}
        className={styles.bell}
        onClick={() => setOpen((value) => !value)}
        aria-label='Notifications'
      >
        <Bell size={24} />

        {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
      </button>

      <AnimatePresence>
        {open && (
          <NotificationDropdown
            notifications={notifications}
            onItemClick={onItemClick}
            onViewAll={onViewAll}
            onClose={() => setOpen(false)}
            triggerRef={triggerRef}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
