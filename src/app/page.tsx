import Image from "next/image";
import Link from "next/link";


export default async function Home() {
  

  return (
    <div className="mx-auto p-4 min-h-screen flex flex-col justify-between items-center">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.5, // 30% transparent
          zIndex: -1, // Ensure it stays in the background
        }}
      ></div>
      <div className="flex justify-between bg-[#eaecf0]  items-center px-3 py-1 shadow-2xl rounded-3xl w-full mb-4">
        <div>
          <Image src="/logo.png" alt="Complain Ease Logo" width={200} height={200} />
        </div>
        <div className="border border-gray-400 px-4 py-2 rounded-3xl cursor-pointer hover:shadow-2xl bg-white">
          login 
        </div>

      </div>
      <div className="mb-5">
        <h4 className="text-3xl font-bold text-black  mb-2">
          Simplify. Track. Resolve.
        </h4>
        <p className="text-lg text-[#28332c] font-medium max-w-[50%]" >
          ComplainEase helps colleges and organizations manage student complaints efficiently with role-based dashboards, real-time tracking, and transparent communication.
        </p>
      </div>
    </div>
  );
}
