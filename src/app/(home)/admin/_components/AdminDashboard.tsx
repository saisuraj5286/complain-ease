"use client";

import { useState } from "react";
import Image from "next/image";
import { api } from "~/trpc/react";
import LogoutButton from "~/app/_components/LogoutButton";

type Status = "pending" | "in_progress" | "resolved" | "rejected";
type Category = "all" | "on_campus" | "hostel" | "transport" | "ragging" | "other";

const statusOptions: Status[] = [
  "pending",
  "in_progress",
  "resolved",
  "rejected",
];

const statusStyles: Record<Status, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  resolved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const AdminDashboard = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<Category>("all");

  const utils = api.useUtils();
  const { data: complaints, isLoading } = api.complaint.getAll.useQuery();

  const updateStatus = api.complaint.updateStatus.useMutation({
    onSuccess: () => {
      void utils.complaint.getAll.invalidate();
    },
  });

  const deleteComplaint = api.complaint.delete.useMutation({
    onSuccess: () => {
      void utils.complaint.getAll.invalidate();
    },
  });

  const filtered = complaints?.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.filedBy.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || c.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalFiled = complaints?.length ?? 0;
  const totalPending =
    complaints?.filter(
      (c) => c.status === "pending" || c.status === "in_progress",
    ).length ?? 0;
  const totalResolved =
    complaints?.filter((c) => c.status === "resolved").length ?? 0;

  return (
    <div className="min-h-screen p-3">
      <div className="flex items-center justify-between rounded-3xl bg-[#f1c6c6] p-3 text-2xl font-bold text-blue-500">
        <Image src="/logo.png" alt="Complain Ease Logo" width={200} height={200} />
        <div className="flex items-center gap-4">
          <span className="text-lg text-gray-700">Admin Dashboard</span>
          <LogoutButton />
        </div>
      </div>

      <div className="my-4 flex flex-row items-center justify-center gap-4">
        <div className="max-w-60 rounded-2xl bg-gray-200 p-4 text-xl font-medium">
          <h4>Total complaints</h4>
          <p className="text-2xl font-bold">{totalFiled}</p>
        </div>
        <div className="max-w-60 rounded-2xl bg-yellow-100 p-4 text-xl font-medium">
          <h4>Pending / in progress</h4>
          <p className="text-2xl font-bold">{totalPending}</p>
        </div>
        <div className="max-w-60 rounded-2xl bg-green-100 p-4 text-xl font-medium">
          <h4>Resolved</h4>
          <p className="text-2xl font-bold">{totalResolved}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <input
          type="text"
          placeholder="search title / description / student"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-2xl border border-black px-4 py-2"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as Status | "all")}
          className="rounded-2xl border border-black px-4 py-2 capitalize"
        >
          <option value="all">All statuses</option>
          {statusOptions.map((s) => (
            <option key={s} value={s} className="capitalize">
              {s.replace("_", " ")}
            </option>
          ))}
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as Category)}
          className="rounded-2xl border border-black px-4 py-2 capitalize"
        >
          <option value="all">All categories</option>
          <option value="on_campus">On campus</option>
          <option value="hostel">Hostel</option>
          <option value="transport">Transport</option>
          <option value="ragging">Ragging</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="p-3">
        <table className="mt-4 w-full table-auto border-collapse border border-gray-400">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Title</th>
              <th className="border border-gray-300 px-4 py-2">Description</th>
              <th className="border border-gray-300 px-4 py-2">Category</th>
              <th className="border border-gray-300 px-4 py-2">Priority</th>
              <th className="border border-gray-300 px-4 py-2">Media</th>
              <th className="border border-gray-300 px-4 py-2">Filed by</th>
              <th className="border border-gray-300 px-4 py-2">Date</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={10} className="border border-gray-300 px-4 py-2 text-center">
                  Loading...
                </td>
              </tr>
            ) : filtered && filtered.length > 0 ? (
              filtered.map((c) => (
                <tr key={c.id}>
                  <td className="border border-gray-300 px-4 py-2">{c.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{c.title}</td>
                  <td className="border border-gray-300 px-4 py-2">{c.description}</td>
                  <td className="border border-gray-300 px-4 py-2 capitalize">{c.category}</td>
                  <td className="border border-gray-300 px-4 py-2 capitalize">{c.priority}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {c.mediaUrl ? (
                      <a href={c.mediaUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                        View
                      </a>
                    ) : (
                      "None"
                    )}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{c.filedBy}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {c.filedAt ? new Date(c.filedAt).toLocaleDateString() : "-"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span className={`rounded-full px-2 py-1 text-sm capitalize ${statusStyles[c.status]}`}>
                      {c.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <div className="flex flex-col gap-2">
                      <select
                        value={c.status}
                        disabled={updateStatus.isPending}
                        onChange={(e) =>
                          updateStatus.mutate({
                            id: c.id,
                            status: e.target.value as Status,
                          })
                        }
                        className="rounded-md border border-gray-400 px-2 py-1 capitalize"
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s} className="capitalize">
                            {s.replace("_", " ")}
                          </option>
                        ))}
                      </select>
                      <button
                        className="text-red-500 hover:underline"
                        onClick={() => deleteComplaint.mutate({ id: c.id })}
                        disabled={deleteComplaint.isPending}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="border border-gray-300 px-4 py-2 text-center">
                  No complaints found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
