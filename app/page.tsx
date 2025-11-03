"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/lib/useTranslations";
import { useSearchParams } from "next/navigation";

export default function Home() {
	const { translations } = useTranslations();
	const searchParams = useSearchParams();
	const currentLang = searchParams.get("lang");
	const brewsHref = currentLang ? `/coffee-brews?lang=${encodeURIComponent(currentLang)}` : "/coffee-brews";
	return (
		<main>
			<Navbar />
			<div className="banner-home">
				<div className="container sm:mx-auto md:mx-auto flex banner-home-copy items-center">
					<h1 className="text-[42px] text-center">{translations("home.title")}</h1>
				</div>
			</div>
			<div className="container-fluid">
				<div className="container sm:mx-auto md:mx-auto text-center copy text-black">
					<h2 className="mb-5 pt-10 md:pt-unset text-black">{translations("home.aboutTitle")}</h2>
					<p className="mb-5">{translations("home.aboutBody")}</p>
					<Link
						href="https://github.com/montanyecreative/compounds-coffee"
						aria-label={translations("home.githubAria")}
						target="_blank"
						rel="noopener"
					>
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
