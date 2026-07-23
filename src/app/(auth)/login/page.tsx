"use client";

import { useActionState } from "react";
import Image from "next/image";
import Link from "next/link";
import { login } from "./actions";

export default function Page() {
	const [state, formAction] = useActionState(login, { error: "" });

	return (
		<div className="mx-auto flex min-h-screen flex-col items-center justify-between p-4">
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

			<div className="mb-4 flex w-full items-center justify-between rounded-3xl bg-[#eaecf0] px-3 py-1 shadow-2xl">
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
				<Link
					href="/signup"
					className="cursor-pointer rounded-3xl border border-gray-400 bg-white px-4 py-2 hover:shadow-2xl"
				>
					Signup
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
							<h4 className="text-2xl font-bold">Enter your credentials</h4>
							<div className="w-full">
								<input
									type="email"
									name="email"
									id="email"
									placeholder="Enter Email"
									autoComplete="email"
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
								Login
							</button>
						</div>
					</form>
					<div className="flex items-center justify-center gap-2">
						Dont have an account?{" "}
						<Link
							href="/signup"
							className="cursor-pointer text-blue-500 hover:underline"
						>
							Signup
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
