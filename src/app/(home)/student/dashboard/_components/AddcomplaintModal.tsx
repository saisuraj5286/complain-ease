'use client';
import React, { useState } from "react";

const AddComplaintModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center  backdrop-blur-md bg-opacity-100"
      onClick={handleOutsideClick}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-[50%]">
        <h2 className="text-xl font-bold mb-4">Add Complaint</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
              placeholder="Enter complaint title"
            />
          </div>
          <div>
            Category
            <div className="py-2 flex flex-wrap">
              <div>
                <input
                  type="radio"
                  id="academic"
                  name="category"
                  value="academic"
                  className="mx-2"
                />
                <label htmlFor="academic" className="mr-4">
                  Academic
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="infrastructure"
                  name="category"
                  value="infrastructure"
                  className="mx-2"
                />
                <label htmlFor="infrastructure" className="mr-4">
                  Infrastructure
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="hostel"
                  name="category"
                  value="hostel"
                  className="mx-2"
                />
                <label htmlFor="hostel" className="mr-4">
                  Hostel
                </label>
              </div>
              <input
                type="radio"
                id="other"
                name="category"
                value="other"
                className="mx-2"
              />
              <label htmlFor="other" className="mr-4">
                Other
              </label>
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
              placeholder="Enter complaint description"
              rows={4}
            ></textarea>
          </div>
          <div className="py-2 flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
          <div className="min-w-[50%]">
            Priority
            <div>
              <select
                name="priority"
                id="priority"
                className=" block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
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
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
            />
          </div>
          </div>
          <div className="py-2">
            upload attachments
            <input
              type="file"
              multiple
              className=" block  border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 w-fit cursor-pointer "
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
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddComplaintModal;