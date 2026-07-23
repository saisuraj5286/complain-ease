import Image from "next/image";
import Link from "next/link";


export default function Home() {
  return (
    <div className="mx-auto p-4 min-h-screen flex flex-col justify-between items-center">
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: "url('/bg.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
      </div>
      <div className="flex justify-between bg-[#eaecf0]  items-center px-3 py-1 shadow-2xl rounded-3xl w-full mb-4">
        <div>
          <Image
            src="/logo.png"
            alt="Complain Ease Logo"
            width={423}
            height={123}
            priority
            className="h-auto w-[180px]"
          />
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="cursor-pointer rounded-3xl border border-gray-400 bg-white px-4 py-2 hover:shadow-2xl"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="cursor-pointer rounded-3xl border border-gray-400 bg-blue-500 px-4 py-2 text-white hover:shadow-2xl"
          >
            Sign Up
          </Link>
        </div>

      </div>
      <div className="mb-5">
        <h4 className="text-3xl font-bold text-white  mb-2">
          Simplify. Track. Resolve.
        </h4>
        <p className="text-lg text-[#dbdbdb] font-medium max-w-[50%]" >
          ComplainEase helps colleges and organizations manage student complaints efficiently with role-based dashboards, real-time tracking, and transparent communication.
        </p>
      </div>
    </div>
  );
}
