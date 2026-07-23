"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { api } from "~/trpc/react";

const NotificationBell = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const utils = api.useUtils();

  const { data: unread } = api.notification.unreadCount.useQuery(undefined, {
    refetchInterval: 20_000,
  });
  const { data: items } = api.notification.list.useQuery(undefined, {
    enabled: open,
  });

  const markRead = api.notification.markRead.useMutation({
    onSuccess: () => {
      void utils.notification.unreadCount.invalidate();
      void utils.notification.list.invalidate();
    },
  });

  const markAllRead = api.notification.markAllRead.useMutation({
    onSuccess: () => {
      void utils.notification.unreadCount.invalidate();
      void utils.notification.list.invalidate();
    },
  });

  const count = unread ?? 0;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative rounded-full p-2 hover:bg-black/5"
        aria-label="Notifications"
      >
        <Bell size={24} />
        {count > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-medium text-white">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 z-20 mt-2 w-80 rounded-xl border border-gray-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 p-3">
              <span className="font-semibold text-gray-800">Notifications</span>
              {count > 0 && (
                <button
                  onClick={() => markAllRead.mutate()}
                  className="text-xs text-blue-500 hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>
            <ul className="max-h-96 overflow-y-auto">
              {items?.length ? (
                items.map((n) => (
                  <li key={n.id}>
                    <button
                      onClick={() => {
                        if (!n.read) markRead.mutate({ id: n.id });
                        setOpen(false);
                        if (n.complaintId) {
                          router.push(`/complaints/${n.complaintId}`);
                        }
                      }}
                      className={`block w-full px-3 py-2 text-left text-sm hover:bg-gray-50 ${
                        n.read ? "text-gray-500" : "font-medium text-gray-900"
                      }`}
                    >
                      {n.message}
                      <span className="mt-0.5 block text-xs font-normal text-gray-400">
                        {new Date(n.createdAt).toLocaleString()}
                      </span>
                    </button>
                  </li>
                ))
              ) : (
                <li className="px-3 py-6 text-center text-sm text-gray-400">
                  No notifications
                </li>
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
