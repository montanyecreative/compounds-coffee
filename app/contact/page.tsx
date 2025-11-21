"use client";

import { Suspense } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Promotion from "@/components/promotion";
import ContactForm from "../../components/contactForm";
import { useTranslations } from "@/lib/useTranslations";

function ContactContent() {
	const { translations } = useTranslations();
	return (
		<>
			<div className="bg-black">
				<div className="page-banner-filler bg-black"></div>
				<div className="container resume-page mx-auto text-white">
					<h1 className="text-[32px] mt-5">{translations("contact.title")}</h1>
					<p className="my-3">{translations("contact.intro")}</p>
					<Suspense fallback={<div className="text-white">Loading form...</div>}>
						<ContactForm />
					</Suspense>
				</div>
			</div>
		</>
	);
}

export const dynamic = "force-dynamic";

export default function ContactUs() {
	return (
		<main>
			<Navbar />
			<Suspense
				fallback={
					<div className="bg-black">
						<div className="page-banner-filler bg-black"></div>
						<div className="container resume-page mx-auto text-white">
							<h1 className="text-[32px] mt-5">Loading...</h1>
						</div>
					</div>
				}
			>
				<ContactContent />
			</Suspense>
			<Footer />
		</main>
	);
}
