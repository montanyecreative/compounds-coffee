"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Promotion from "@/components/promotion";
import ContactForm from "../../components/contactForm";
import { useTranslations } from "@/lib/useTranslations";

export default function ContactUs() {
	const { translations } = useTranslations();
	return (
		<main>
			<Navbar />
			<div className="bg-black">
				<div className="page-banner-filler bg-black"></div>
				<div className="container resume-page mx-auto text-white">
					<h1 className="text-[32px] mt-5">{translations("contact.title")}</h1>
					<p className="my-3">{translations("contact.intro")}</p>
					<ContactForm />
				</div>
			</div>
			<Footer />
		</main>
	);
}
