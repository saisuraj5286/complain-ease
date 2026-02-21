'use client';

import { User } from "lucide-react";
import React, { useState } from "react";
import AddComplaintModal from "./_components/AddcomplaintModal";
import Image from "next/image";
import { api } from "~/trpc/react";

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const { data: complaints, isLoading } = api.complaint.getAll.useQuery();

  const utils = api.useUtils();

  const deleteComplaint = api.complaint.delete.useMutation({
    onSuccess: () => {
      void utils.complaint.getAll.invalidate();
    },
  });

  const filteredComplaints = complaints?.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase()),
  );

  const totalFiled = complaints?.length ?? 0;
  const totalPending = complaints?.filter((c) => c.status === "pending" || c.status === "in_progress").length ?? 0;
  const totalResolved = complaints?.filter((c) => c.status === "resolved").length ?? 0;

  return (
    <div className="h-screen p-3">
      <div className="text-2xl font-bold rounded-3xl text-blue-500 bg-[#f1c6c6] flex items-center justify-between p-3">
        <Image src="/logo.png" alt="Complain Ease Logo" width={200} height={200} />
        <button className="ml-4 text-lg bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          Logout
        </button>
      </div>
      <div className="flex flex-col items-start py-2">
        <h2>Welcome to your Dashboard</h2>
      </div>
      <div className="flex flex-row items-center justify-between gap-3 mb-4 p-2">
        <div className="flex flex-row items-center gap-3">
          <div className="rounded-full bg-gray-300 overflow-hidden">
            <User size={100} />
          </div>
          <div>
            <h4 className="text-lg font-medium">sai suraj</h4>
            <p>student id: 123456</p>
            <p>class: IT</p>
            <p>section: 1</p>
          </div>
        </div>
        <div className="flex flex-row items-center gap-4">
          <div className="h-full bg-gray-300 rounded-2xl text-xl font-medium p-3 max-w-50">
            <h4>no. of complains filed:</h4>
            <p>{totalFiled}</p>
          </div>
          <div className="h-full bg-gray-300 rounded-2xl text-xl font-medium p-3 max-w-50">
            <h4>no. of complains pending:</h4>
            <p>{totalPending}</p>
          </div>
          <div className="h-full bg-gray-300 rounded-2xl text-xl font-medium p-3 max-w-50">
            <h4>no. of complains resolved:</h4>
            <p>{totalResolved}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-3 justify-center">
        <button
          className="border border-blue-500 shadow-2xl bg-blue-200 font-medium text-xl px-4 py-2 rounded-2xl text-gray-700"
          onClick={openModal}
        >
          Add Complaint
        </button>
        <input
          type="text"
          placeholder="search complaint"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-black px-4 py-2 rounded-2xl"
        />
      </div>
      <div className="p-3">
        <div>
          <table className="table-auto border-collapse border border-gray-400 w-full mt-4">
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
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="border border-gray-300 px-4 py-2 text-center">
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
                    <td className="border border-gray-300 px-4 py-2 capitalize">{complaint.status.replace("_", " ")}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {complaint.filedAt ? new Date(complaint.filedAt).toLocaleDateString() : "-"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        className="text-red-500 hover:underline"
                        onClick={() => deleteComplaint.mutate({ id: complaint.id })}
                        disabled={deleteComplaint.isPending}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="border border-gray-300 px-4 py-2 text-center">
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

export default Page;
