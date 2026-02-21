'use client';
import React, { useState } from "react";
import { api } from "~/trpc/react";

const AddComplaintModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<"on_campus" | "hostel" | "transport" | "ragging" | "other">("on_campus");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");

  const utils = api.useUtils();

  const createComplaint = api.complaint.create.useMutation({
    onSuccess: () => {
      void utils.complaint.getAll.invalidate();
      setTitle("");
      setDescription("");
      setCategory("on_campus");
      setPriority("medium");
      onClose();
    },
  });

  if (!isOpen) return null;

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createComplaint.mutate({
      title,
      description,
      category,
      priority,
      filedBy: "123456",
    });
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-opacity-100"
      onClick={handleOutsideClick}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-[50%]">
        <h2 className="text-xl font-bold mb-4">Add Complaint</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
              placeholder="Enter complaint title"
              required
            />
          </div>
          <div>
            Category
            <div className="py-2 flex flex-wrap">
              <div>
                <input
                  type="radio"
                  id="on_campus"
                  name="category"
                  value="on_campus"
                  checked={category === "on_campus"}
                  onChange={() => setCategory("on_campus")}
                  className="mx-2"
                />
                <label htmlFor="on_campus" className="mr-4">
                  On Campus
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="hostel"
                  name="category"
                  value="hostel"
                  checked={category === "hostel"}
                  onChange={() => setCategory("hostel")}
                  className="mx-2"
                />
                <label htmlFor="hostel" className="mr-4">
                  Hostel
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="transport"
                  name="category"
                  value="transport"
                  checked={category === "transport"}
                  onChange={() => setCategory("transport")}
                  className="mx-2"
                />
                <label htmlFor="transport" className="mr-4">
                  Transport
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="ragging"
                  name="category"
                  value="ragging"
                  checked={category === "ragging"}
                  onChange={() => setCategory("ragging")}
                  className="mx-2"
                />
                <label htmlFor="ragging" className="mr-4">
                  Ragging
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="other"
                  name="category"
                  value="other"
                  checked={category === "other"}
                  onChange={() => setCategory("other")}
                  className="mx-2"
                />
                <label htmlFor="other" className="mr-4">
                  Other
                </label>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
              placeholder="Enter complaint description"
              rows={4}
              required
            ></textarea>
          </div>
          <div className="py-2 flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
            <div className="min-w-[50%]">
              Priority
              <div>
                <select
                  name="priority"
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high" | "urgent")}
                  className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
            <div className="min-w-[50%]">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date Filed
              </label>
              <input
                type="date"
                id="date"
                defaultValue={new Date().toISOString().split("T")[0]}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                disabled
              />
            </div>
          </div>
          <div className="py-2">
            Upload Attachments
            <input
              type="file"
              multiple
              className="block border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 w-fit cursor-pointer"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createComplaint.isPending}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {createComplaint.isPending ? "Submitting..." : "Submit"}
            </button>
          </div>
          {createComplaint.isError && (
            <p className="text-red-500 mt-2 text-sm">
              Failed to submit complaint. Please try again.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddComplaintModal;
