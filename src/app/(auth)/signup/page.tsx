import Image from "next/image";
import React from "react";

const page = () => {
  return (
    <div className="mx-auto p-4 min-h-screen ">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.2, // 30% transparent
          zIndex: -1, // Ensure it stays in the background
        }}
      ></div>

      <div className="mb-4 flex w-full items-center justify-between rounded-3xl bg-[#687381] px-3 py-1 shadow-2xl">
        <div>
          <Image
            src="/logo.png"
            alt="Complain Ease Logo"
            width={200}
            height={200}
          />
        </div>
        <div className="cursor-pointer rounded-3xl border border-gray-400 bg-white px-4 py-2 hover:shadow-2xl">
          Login
        </div>
      </div>
      <div className=" w-full h-full rounded-3xl p-6 shadow-2xl flex flex-row items-center justify-center gap-10 ">
        <div className="max-w-[48%] ">
            <h4 className="mb-2 text-3xl font-bold text-black">
                Simplify. Track. Resolve.   
            </h4>
            <p className="text-lg font-medium text-[#28332c]">
                ComplainEase helps colleges and organizations manage student complaints efficiently with role-based dashboards, real-time tracking, and transparent communication.
            </p>
        </div>
        
        <div className="max-w-[48%] w-full bg-white p-6 rounded-3xl shadow-lg flex flex-col gap-4"> 
            <div>
                <div className="flex flex-col items-center justify-center text-lg gap-2 ">
                <h4 className="text-2xl font-bold">Enter your credentials</h4>
                
                <div>
                    <input type="text" placeholder="Enter Email" className="mb-2 w-full rounded-2xl border border-gray-500 px-3 py-2" />
                </div>
                <div>
                    <input type="text" placeholder="Enter Roll Number" className="mb-2 w-full rounded-2xl border border-gray-500 px-3 py-2" />
                </div>
                <div>
                    <input type="password" placeholder="Enter Password" className="mb-2 w-full rounded-2xl border border-gray-500 px-3 py-2" />
                </div>
                </div>
            <div className=" flex items-center justify-center">
                <button className="w-fit rounded bg-[#687381] px-4 py-2 text-white hover:bg-[#5a5f68]">
                    Login
                </button>
            </div>
            </div>
            <div className="flex items-center justify-center gap-2">
                Dont have an account? <span className="cursor-pointer hover:underline text-blue-500">Login</span>
            </div>
            <div className="  flex items-center justify-center gap-3 ">
                <div className="bg-gray-500 h-0.5 w-full">
                </div>
                or
                <div className="bg-gray-500 h-0.5 w-full">
                </div>
            </div>
            <div>
                <div className="flex items-center justify-center gap-3"> 
                <div className="border border-gray-500 px-4 py-2 rounded-3xl">
                    <p>Google</p>
                </div>
                <div className="border border-gray-500 px-4 py-2 rounded-3xl">
                    <p>Facebook</p>
                </div>
                </div>
            </div>           
        </div>
        
      </div>
      
    </div>
  );
};

export default page;
