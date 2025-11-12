"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "@/lib/useTranslations";

export default function PrivacyPolicy() {
	const searchParams = useSearchParams();
	const currentLang = searchParams.get("lang") || "en-US";
	const { translations } = useTranslations();

	const buildHrefWithLang = (pathname: string, lang: string) => {
		const params = new URLSearchParams(searchParams?.toString() || "");
		params.set("lang", lang);
		const query = params.toString();
		return query ? `${pathname}?${query}` : pathname;
	};

	return (
		<main>
			<Navbar />
			<div className="page-banner-filler bg-black"></div>
			<div className="container sm:mx-auto md:mx-auto privacy-page bg-black text-white">
				<div className="grid grid-cols-1 pt-10 mx-auto md:mx-20 justify-center">
					<h2 className="text-[34px] mb-2 text-white">{translations("privacyPolicy.title")}</h2>
					<p className="italic">{translations("privacyPolicy.intro")}</p>
					<h3 className="font-bold mt-3 mb-2">{translations("privacyPolicy.sections.whatWeCollect")}</h3>
					<p className="my-1">{translations("privacyPolicy.sections.whatWeCollectDesc1")}</p>
					<p className="my-1">{translations("privacyPolicy.sections.whatWeCollectDesc2")}</p>
					<h3 className="font-bold mt-3 mb-2">{translations("privacyPolicy.sections.technologies")}</h3>
					<p className="my-1">{translations("privacyPolicy.sections.cookies")}</p>
					<p className="my-1">{translations("privacyPolicy.sections.logFiles")}</p>
					<p className="my-1">{translations("privacyPolicy.sections.orderInfo")}</p>
					<p className="my-1">{translations("privacyPolicy.sections.personalInfo")}</p>
					<h3 className="font-bold mt-3 mb-2">{translations("privacyPolicy.sections.howWeUse")}</h3>
					<p className="my-1">{translations("privacyPolicy.sections.howWeUseDesc")}</p>
					<h3 className="font-bold mt-3 mb-2">{translations("privacyPolicy.sections.additionally")}</h3>
					<ul className="list-disc mx-5">
						<li>{translations("privacyPolicy.sections.communicate")}</li>
						<li>{translations("privacyPolicy.sections.screenOrders")}</li>
						<li>{translations("privacyPolicy.sections.advertising")}</li>
						<li>{translations("privacyPolicy.sections.deviceInfo")}</li>
					</ul>
					<h3 className="font-bold mt-3 mb-2">{translations("privacyPolicy.sections.sharing")}</h3>
					<p className="my-1">{translations("privacyPolicy.sections.sharingDesc1")}</p>
					<p className="my-1">{translations("privacyPolicy.sections.sharingDesc2")}</p>
					<p className="my-1">{translations("privacyPolicy.sections.sharingDesc3")}</p>
					<h3 className="font-bold mt-3 mb-2">{translations("privacyPolicy.sections.behavioural")}</h3>
					<p className="my-1">
						{translations("privacyPolicy.sections.behaviouralDesc")}{" "}
						<span className="font-bold">
							{translations("privacyPolicy.sections.optOut")}{" "}
							<Link
								href={buildHrefWithLang("/contact", currentLang)}
								aria-label={translations("privacyPolicy.ariaLabels.contactUs")}
							>
								{translations("privacyPolicy.sections.here")}
							</Link>
						</span>
					</p>
					<h3 className="font-bold mt-3 mb-2">{translations("privacyPolicy.sections.rights")}</h3>
					<p className="my-1">
						{translations("privacyPolicy.sections.rightsDesc1")}{" "}
						<Link
							href={buildHrefWithLang("/contact", currentLang)}
							aria-label={translations("privacyPolicy.ariaLabels.contactUs")}
						>
							{translations("privacyPolicy.sections.contactUs")}
						</Link>
						.
					</p>
					<p className="my-1">{translations("privacyPolicy.sections.rightsDesc2")}</p>
					<p className="my-1">{translations("privacyPolicy.sections.rightsDesc3")}</p>
					<h3 className="font-bold mt-3 mb-2">{translations("privacyPolicy.sections.dataRetention")}</h3>
					<p className="my-1">{translations("privacyPolicy.sections.dataRetentionDesc")}</p>
					<h3 className="font-bold mt-3 mb-2">{translations("privacyPolicy.sections.minors")}</h3>
					<p className="my-1">{translations("privacyPolicy.sections.minorsDesc")}</p>
					<h3 className="font-bold mt-3 mb-2">{translations("privacyPolicy.sections.changes")}</h3>
					<p className="my-1">{translations("privacyPolicy.sections.changesDesc")}</p>
					<p className="font-bold my-1">
						{translations("privacyPolicy.sections.questions")}{" "}
						<Link
							href={buildHrefWithLang("/contact", currentLang)}
							aria-label={translations("privacyPolicy.ariaLabels.contactUs")}
						>
							{translations("privacyPolicy.sections.contactUsHere")}
						</Link>
					</p>
				</div>
			</div>
			<Footer />
		</main>
	);
}
