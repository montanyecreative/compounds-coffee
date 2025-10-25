"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AddABrewForm from "@/components/addABrewForm";

export default function AddABrew() {
	return (
		<main>
			<Navbar />
			<div className="page-banner-filler bg-mediumRoast"></div>
			<div className="container-fluid">
				<div className="container sm:mx-auto md:mx-auto copy text-black">
					<h2 className="mb-5 pt-10 md:pt-unset text-black">Add a brew</h2>
					<AddABrewForm />
				</div>
			</div>
			<div className="container-fluid">
				<div className="banner-salesforce">
					<div className="container sm:mx-auto md:mx-auto text-center copy text-black">
						<h2 className="mb-5 pt-5 md:pt-unset text-black">Coffee Brews</h2>
						<p className="mb-5 text-black">To the Coffee Brews page.</p>
						<Link href="/coffee-brews" aria-label="Go to the Brews page">
							<Button className="rounded-full px-10 mb-10 md:mb-unset text-mediumRoast border hover:bg-brown hover:border-brown hover:text-white cursor-pointer uppercase text-[12px]">
								See Coffee Brews
							</Button>
						</Link>
					</div>
				</div>
			</div>
			<Footer />
		</main>
	);
}
