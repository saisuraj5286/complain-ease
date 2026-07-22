"use client";

import { User } from "lucide-react";
import { useState } from "react";
import AddComplaintModal from "./AddcomplaintModal";
import Image from "next/image";
import { api } from "~/trpc/react";
import LogoutButton from "~/app/_components/LogoutButton";

const statusStyles: Record<string, string> = {
  pending: "text-yellow-600",
  in_progress: "text-blue-600",
  resolved: "text-green-600",
  rejected: "text-red-600",
};

const DashboardClient = ({
  username,
  rollNo,
}: {
  username: string;
  rollNo: string;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const { data: complaints, isLoading } = api.complaint.getMine.useQuery();

  const filteredComplaints = complaints?.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase()),
  );

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
        <LogoutButton />
      </div>
      <div className="flex flex-col items-start py-2"></div>
      <div className="mb-4 flex flex-row items-center justify-between gap-3 p-2">
        <div className="flex flex-row items-center gap-3">
          <div className="overflow-hidden rounded-full bg-gray-300">
            <User size={100} />
          </div>
          <div>
            <h4 className="text-lg font-medium capitalize">{username}</h4>
            <p>roll no: {rollNo}</p>
          </div>
        </div>
        <div className="flex flex-row items-center gap-4">
          <div className="max-w-50 h-full rounded-2xl bg-gray-300 p-3 text-xl font-medium">
            <h4>no. of complaints filed:</h4>
            <p>{totalFiled}</p>
          </div>
          <div className="max-w-50 h-full rounded-2xl bg-gray-300 p-3 text-xl font-medium">
            <h4>no. of complaints pending:</h4>
            <p>{totalPending}</p>
          </div>
          <div className="max-w-50 h-full rounded-2xl bg-gray-300 p-3 text-xl font-medium">
            <h4>no. of complaints resolved:</h4>
            <p>{totalResolved}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-center gap-3">
        <button
          className="rounded-2xl border border-blue-500 bg-blue-200 px-4 py-2 text-xl font-medium text-gray-700 shadow-2xl"
          onClick={openModal}
        >
          Add Complaint
        </button>
        <input
          type="text"
          placeholder="search complaint"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-2xl border border-black px-4 py-2"
        />
      </div>
      <div className="p-3">
        <div>
          <table className="mt-4 w-full table-auto border-collapse border border-gray-400">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Complaint ID</th>
                <th className="border border-gray-300 px-4 py-2">Title</th>
                <th className="border border-gray-300 px-4 py-2">Description</th>
                <th className="border border-gray-300 px-4 py-2">Category</th>
                <th className="border border-gray-300 px-4 py-2">Priority</th>
                <th className="border border-gray-300 px-4 py-2">Photo/Video</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
                <th className="border border-gray-300 px-4 py-2">Date Filed</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="border border-gray-300 px-4 py-2 text-center">
                    Loading...
                  </td>
                </tr>
              ) : filteredComplaints && filteredComplaints.length > 0 ? (
                filteredComplaints.map((complaint) => (
                  <tr key={complaint.id}>
                    <td className="border border-gray-300 px-4 py-2">{complaint.id}</td>
                    <td className="border border-gray-300 px-4 py-2">{complaint.title}</td>
                    <td className="border border-gray-300 px-4 py-2">{complaint.description}</td>
                    <td className="border border-gray-300 px-4 py-2 capitalize">{complaint.category}</td>
                    <td className="border border-gray-300 px-4 py-2 capitalize">{complaint.priority}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {complaint.mediaUrl ? (
                        <a href={complaint.mediaUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                          View
                        </a>
                      ) : (
                        "None"
                      )}
                    </td>
                    <td className={`border border-gray-300 px-4 py-2 capitalize ${statusStyles[complaint.status] ?? ""}`}>
                      {complaint.status.replace("_", " ")}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {complaint.filedAt ? new Date(complaint.filedAt).toLocaleDateString() : "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="border border-gray-300 px-4 py-2 text-center">
                    No complaints found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <AddComplaintModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default DashboardClient;
