"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useTranslations } from "@/lib/useTranslations";

type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>;

function createLoginSchema(translations: (key: string) => string) {
	return z.object({
		email: z.string().email(translations("login.errors.emailRequired")),
		password: z.string().min(1, translations("login.errors.passwordRequired")),
	});
}

function LoginForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl") || "/";
	const { translations } = useTranslations();
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const loginSchema = createLoginSchema(translations);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = async (data: LoginFormData) => {
		setError(null);
		setIsLoading(true);

		try {
			const result = await signIn("credentials", {
				email: data.email,
				password: data.password,
				redirect: false,
			});

			if (result?.error) {
				// NextAuth v5 may return different error codes
				const errorMessage =
					result.error === "CredentialsSignin" || result.error === "Invalid credentials"
						? translations("login.errors.invalidCredentials")
						: result.error;
				setError(errorMessage);
				setIsLoading(false);
			} else if (result?.ok) {
				router.push(callbackUrl);
				router.refresh();
			} else {
				// Handle case where result is undefined or doesn't have ok/error
				setError(translations("login.errors.unexpected"));
				setIsLoading(false);
			}
		} catch (err) {
			console.error("Login error:", err);
			const errorMessage = err instanceof Error ? err.message : translations("login.errors.unexpected");
			setError(errorMessage);
			setIsLoading(false);
		}
	};

	return (
		<main>
			<Navbar />
			<div className="container mx-auto px-4 py-16 min-h-[calc(100vh-200px)] flex items-center justify-center">
				<div className="w-full max-w-md">
					<div className="bg-white rounded-lg shadow-lg p-8">
						<h1 className="text-3xl font-bold text-center mb-2 text-gray-900">{translations("login.title")}</h1>

						{error && (
							<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
								<p className="text-sm text-red-800">{error}</p>
							</div>
						)}

						<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
							<div className="space-y-2">
								<Label htmlFor="email">{translations("login.labels.email")}</Label>
								<Input
									id="email"
									type="email"
									placeholder={translations("login.placeholders.email")}
									{...register("email")}
									className={errors.email ? "border-red-500" : ""}
									disabled={isLoading}
								/>
								{errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
							</div>

							<div className="space-y-2">
								<Label htmlFor="password">{translations("login.labels.password")}</Label>
								<Input
									id="password"
									type="password"
									placeholder={translations("login.placeholders.password")}
									{...register("password")}
									className={errors.password ? "border-red-500" : ""}
									disabled={isLoading}
								/>
								{errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
							</div>

							<Button
								type="submit"
								className="rounded-full px-10 w-full mb-10 md:mb-unset text-mediumRoast border hover:bg-brown hover:border-brown hover:text-white cursor-pointer uppercase text-[12px]"
								disabled={isLoading}
							>
								{isLoading ? translations("login.button.signingIn") : translations("login.button.signIn")}
							</Button>
						</form>
					</div>
				</div>
			</div>
			<Footer />
		</main>
	);
}

export const dynamic = "force-dynamic";

export default function LoginPage() {
	return (
		<Suspense
			fallback={
				<main>
					<Navbar />
					<div className="container mx-auto px-4 py-16 min-h-[calc(100vh-200px)] flex items-center justify-center">
						<div className="w-full max-w-md">
							<div className="bg-white rounded-lg shadow-lg p-8">
								<h1 className="text-3xl font-bold text-center mb-2 text-gray-900">Loading...</h1>
							</div>
						</div>
					</div>
					<Footer />
				</main>
			}
		>
			<LoginForm />
		</Suspense>
	);
}
