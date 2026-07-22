"use client";

import { useActionState } from "react";
import { signup } from "./actions";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
	const [state, formAction] = useActionState(signup, { error: "" });

	return (
		<div className="mx-auto flex min-h-screen flex-col items-center justify-between p-4">
			<div
				className="absolute inset-0 -z-10"
				style={{
					backgroundImage: "url('/bg.png')",
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			>
				<div className="absolute inset-0 bg-black/70"></div>
			</div>

			<div className="mb-4 flex w-full items-center justify-between rounded-3xl bg-[#eaecf0] px-3 py-1 shadow-2xl">
				<div>
					<Image
						src="/logo.png"
						alt="Complain Ease Logo"
						width={200}
						height={200}
					/>
				</div>
				<Link
					href="/login"
					className="cursor-pointer rounded-3xl border border-gray-400 bg-white px-4 py-2 hover:shadow-2xl"
				>
					Login
				</Link>
			</div>

			<div className="flex h-full w-full flex-row items-center justify-center gap-10 rounded-3xl p-6 shadow-2xl">
				<div className="max-w-[48%]">
					<h4 className="mb-2 text-3xl font-bold text-white">
						Simplify. Track. Resolve.
					</h4>
					<p className="text-lg font-medium text-[#d4d4d4]">
						ComplainEase helps colleges and organizations manage student
						complaints efficiently with role-based dashboards, real-time
						tracking, and transparent communication.
					</p>
				</div>

				<div className="flex w-full max-w-[48%] flex-col gap-4 rounded-3xl bg-gray-200 p-6 shadow-lg">
					<form action={formAction}>
						<div className="flex flex-col items-center justify-center gap-4 text-xl">
							<h4 className="text-2xl font-bold">Create an account</h4>
							<div className="w-full">
								<input
									type="text"
									name="username"
									id="username"
									placeholder="Enter Username"
									className="mb-2 w-full rounded-2xl border border-gray-500 px-3 py-2"
								/>
							</div>
							<div className="w-full">
								<input
									type="text"
									name="rollNo"
									id="rollNo"
									placeholder="Enter Roll Number"
									className="mb-2 w-full rounded-2xl border border-gray-500 px-3 py-2"
								/>
							</div>
							<div className="w-full">
								<input
									type="password"
									name="password"
									id="password"
									placeholder="Enter Password"
									className="mb-2 w-full rounded-2xl border border-gray-500 px-3 py-2"
								/>
							</div>
						</div>
						{state.error && (
							<p className="mt-2 text-center text-red-500">{state.error}</p>
						)}
						<div className="mt-4 flex items-center justify-center">
							<button className="w-fit rounded bg-[#687381] px-4 py-2 text-white hover:bg-[#5a5f68]">
								Sign Up
							</button>
						</div>
					</form>
					<div className="flex items-center justify-center gap-2">
						Already have an account?{" "}
						<Link
							href="/login"
							className="cursor-pointer text-blue-500 hover:underline"
						>
							Login
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
