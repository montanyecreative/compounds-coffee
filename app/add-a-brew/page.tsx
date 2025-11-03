"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AddABrewForm from "@/components/addABrewForm";
import { useTranslations } from "@/lib/useTranslations";
import { useSearchParams } from "next/navigation";

export default function AddABrew() {
	const { translations } = useTranslations();
	const searchParams = useSearchParams();
	const currentLang = searchParams.get("lang");
	const brewsHref = currentLang ? `/coffee-brews?lang=${encodeURIComponent(currentLang)}` : "/coffee-brews";
	return (
		<main>
			<Navbar />
			<div className="page-banner-filler bg-mediumRoast"></div>
			<div className="container-fluid">
				<div className="container sm:mx-auto md:mx-auto copy text-black">
					<h2 className="mb-5 pt-10 md:pt-unset text-black">{translations("addABrew.title")}</h2>
					<AddABrewForm />
				</div>
			</div>
			<div className="container-fluid">
				<div className="banner-salesforce">
					<div className="container sm:mx-auto md:mx-auto text-center copy text-black">
						<h2 className="mb-5 pt-5 md:pt-unset text-black">{translations("addABrew.ctaTitle")}</h2>
						<p className="mb-5 text-black">{translations("addABrew.ctaDesc")}</p>
						<Link href={brewsHref} aria-label={translations("addABrew.ctaAria")}>
							<Button className="rounded-full px-10 mb-10 md:mb-unset text-mediumRoast border hover:bg-brown hover:border-brown hover:text-white cursor-pointer uppercase text-[12px]">
								{translations("addABrew.ctaButton")}
							</Button>
						</Link>
					</div>
				</div>
			</div>
			<Footer />
		</main>
	);
}
