"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Promotion from "@/components/promotion";
import ContactForm from "../../components/contactForm";

export default function ContactUs() {
	return (
		<main>
			<Navbar />
			<div className="bg-black">
				<div className="page-banner-filler bg-black"></div>
				<div className="container resume-page mx-auto text-white">
					<h1 className="text-[32px] mt-5">Contact Us</h1>
					<p className="my-3">Please fill out the form below and we will get in touch with you as soon as we can.</p>
					<ContactForm />
				</div>
			</div>
			<Footer />
		</main>
	);
}
