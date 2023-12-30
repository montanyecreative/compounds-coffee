"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import BrewLogForm from "@/components/brewLogForm";

export default function Home() {
	return (
		<main>
			<Navbar />
			<div className="page-banner-filler bg-mediumRoast"></div>
			<div className="container-fluid">
				<div className="container sm:mx-auto md:mx-auto copy text-black">
					<BrewLogForm />
				</div>
			</div>
			<div className="container-fluid">
				<div className="banner-salesforce">
					<div className="container sm:mx-auto md:mx-auto text-center copy text-black">
						<h2 className="mb-5 pt-5 md:pt-unset text-black">Favorite Coffees</h2>
						<p className="mb-5 text-black">To the Favorite Coffees page.</p>
						<Link href="/favorite-coffees" aria-label="Go to the Favorite Coffees page">
							<Button className="rounded-full px-10 mb-10 md:mb-unset text-mediumRoast border hover:bg-highlight hover:border-highlight hover:text-white cursor-pointer uppercase text-[12px]">
								See Favorite Coffees
							</Button>
						</Link>
					</div>
				</div>
			</div>
			<Footer />
		</main>
	);
}
