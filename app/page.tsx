"use client";

import { Suspense } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/lib/useTranslations";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

function HomeContent() {
	const { translations } = useTranslations();
	const searchParams = useSearchParams();
	const currentLang = searchParams.get("lang");
	const brewsHref = currentLang ? `/coffee-brews?lang=${encodeURIComponent(currentLang)}` : "/coffee-brews";
	return (
		<main>
			<Navbar />
			<div className="relative banner-home h-[600px]">
				<Image
					src="/banner-home.webp"
					alt={translations("alt.homeBanner")}
					fill
					priority
					className="object-cover object-center"
					sizes="100vw"
				/>
				<div className="absolute inset-0 flex items-center justify-center z-10">
					<h1 className="text-[42px] text-center text-white">{translations("home.title")}</h1>
				</div>
			</div>
			<div className="container-fluid">
				<div className="container sm:mx-auto md:mx-auto text-center copy text-black">
					<h2 className="mb-5 pt-10 md:pt-unset text-black">{translations("home.aboutTitle")}</h2>
					<p className="mb-5">{translations("home.aboutBody")}</p>
					<Link href="/how-im-made" aria-label={translations("home.githubAria")}>
						<Button className="rounded-full px-10 mb-10 md:mb-unset text-mediumRoast border hover:bg-brown hover:border-brown hover:text-white cursor-pointer uppercase text-[12px]">
							{translations("home.githubButton")}
						</Button>
					</Link>
				</div>
			</div>
			<div className="container-fluid">
				<div className="banner-salesforce">
					<div className="container sm:mx-auto md:mx-auto text-center copy text-black">
						<h2 className="mb-5 pt-5 md:pt-unset text-black">{translations("home.ctaTitle")}</h2>
						<p className="mb-5 text-black">{translations("home.ctaDesc")}</p>
						<Link href={brewsHref} aria-label={translations("home.ctaAria")}>
							<Button className="rounded-full px-10 mb-10 md:mb-unset text-mediumRoast border hover:bg-brown hover:border-brown hover:text-white cursor-pointer uppercase text-[12px]">
								{translations("home.ctaButton")}
							</Button>
						</Link>
					</div>
				</div>
			</div>
			<Footer />
		</main>
	);
}

export const dynamic = "force-dynamic";

export default function Home() {
	return (
		<Suspense
			fallback={
				<main>
					<Navbar />
					<div className="container mx-auto px-4 py-16 min-h-[calc(100vh-200px)] flex items-center justify-center">
						<div>Loading...</div>
					</div>
					<Footer />
				</main>
			}
		>
			<HomeContent />
		</Suspense>
	);
}
