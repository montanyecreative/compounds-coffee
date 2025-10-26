import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCoffeeBrews } from "@/lib/contentful";
import BrewsTable from "@/components/brewsTable";

export default async function CoffeeBrews() {
	const brews = await getCoffeeBrews();

	return (
		<main>
			<Navbar />
			<div className="page-banner-filler bg-mediumRoast"></div>
			<div className="container-fluid">
				<div className="container sm:mx-auto md:mx-auto copy text-black">
					<h2 className="mb-5 pt-10 md:pt-unset text-black">Coffee Brews</h2>

					{brews.length === 0 ? (
						<div className="text-center py-10">
							<p className="text-gray-600 mb-4">
								No coffee brews found. Make sure your Contentful credentials are set up correctly.
							</p>
							<Link href="/add-a-brew">
								<Button>Add Your First Brew</Button>
							</Link>
						</div>
					) : (
						<BrewsTable brews={brews} />
					)}
				</div>
			</div>
			<Footer />
		</main>
	);
}
