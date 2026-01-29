import { User } from "lucide-react";
import React from "react";

const page = () => {
  return (
    <div className="h-screen p-3">
      <div className="text-2xl font-bold text-blue-500">Complain-Ease</div>
      <div className="flex flex-col items-start py-2">
        <h2>Welcome to your Dashboard</h2>
        <p>Here you can manage your complaints and view their status.</p>
      </div>
      <div className="flex flex-row items-center gap-3 mb-4">
        <div className="rounded-full bg-gray-300 overflow-hidden">
            <User size={100}/>
            {/* image */}
        </div>
        <div>
            <h4>sai suraj</h4>
            <p>student id: 123456</p>
            <p>class: IT</p>
            <p>section: 1</p>
        </div>
      </div>
      <div className="flex flex-row gap-3 justify-center">
        <button className="border border-blue-500 shadow-2xl bg-blue-200 font-medium text-xl px-4 py-2 rounded-2xl text-gray-700">
            add complaint
        </button>
        <button className="border border-blue-500 shadow-2xl bg-blue-200 font-medium text-xl px-4 py-2 rounded-2xl text-gray-700">
            view status
        </button>
        <input
          type="text"
          placeholder="search compliant"
          className="border border-black px-4 py-2 rounded-2xl"
        /> 
      </div>
      <div >
       
        <div>
          <table className="table-auto border-collapse border border-gray-400 w-full mt-4">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Complaint ID</th>
                <th className="border border-gray-300 px-4 py-2">Title</th>
                <th className="border border-gray-300 px-4 py-2">Description</th>
                <th className="border border-gray-300 px-4 py-2">add photo/video</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
                <th className="border border-gray-300 px-4 py-2">Date Filed</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">1</td>
                <td className="border border-gray-300 px-4 py-2">Broken AC</td>
                <td className="border border-gray-300 px-4 py-2">The AC in room 101 is not working.</td>
                                <td className="border border-gray-300 px-4 py-2">added photo</td>

                <td className="border border-gray-300 px-4 py-2">Assigned</td>
                <td className="border border-gray-300 px-4 py-2">2026-01-28</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button className="text-blue-500">Edit</button> | <button className="text-red-500">Delete</button>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">2</td>
                <td className="border border-gray-300 px-4 py-2">Leaking Pipe</td>
                <td className="border border-gray-300 px-4 py-2">There is a leaking pipe in the bathroom.</td>
                <td className="border border-gray-300 px-4 py-2">cant provide</td>
                <td className="border border-gray-300 px-4 py-2">Pending</td>
                <td className="border border-gray-300 px-4 py-2">2026-01-27</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button className="text-blue-500">Edit</button> | <button className="text-red-500">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default page;
