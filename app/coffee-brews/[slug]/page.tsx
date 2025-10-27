import { notFound } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCoffeeBrewBySlug, getCoffeeBrews } from "@/lib/contentful";
import { gramsToFluidOunces } from "@/lib/utils";

interface BrewDetailPageProps {
	params: {
		slug: string;
	};
}

export async function generateStaticParams() {
	const brews = await getCoffeeBrews();
	return brews.map((brew) => ({
		slug: brew.fields.slug || brew.sys.id,
	}));
}

export default async function BrewDetailPage({ params }: BrewDetailPageProps) {
	const { slug } = await params;

	console.log("Fetching brew with slug:", slug);
	const brew = await getCoffeeBrewBySlug(slug);

	console.log("Brew found:", brew ? "Yes" : "No");

	if (!brew) {
		notFound();
	}

	return (
		<main>
			<Navbar />
			<div className="page-banner-filler bg-mediumRoast"></div>
			<div className="container-fluid">
				<div className="container sm:mx-auto md:mx-auto copy text-black">
					<div className="pt-10 md:pt-unset">
						<Link href="/coffee-brews">
							<Button variant="outline" className="mb-5">
								← Back to Coffee Brews
							</Button>
						</Link>

						<h1 className="text-4xl font-bold mb-8">{brew.fields.name}</h1>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
							<div className="space-y-6">
								<section>
									<h2 className="text-2xl font-semibold mb-4 text-brown">Coffee Details</h2>
									<div className="space-y-3">
										<div className="flex justify-between border-b pb-2">
											<span className="font-medium">Region:</span>
											<span>{brew.fields.region}</span>
										</div>
										<div className="flex justify-between border-b pb-2">
											<span className="font-medium">Roast Level:</span>
											<span>{brew.fields.roastLevel}</span>
										</div>
										<div className="flex justify-between border-b pb-2">
											<span className="font-medium">Process:</span>
											<span>{brew.fields.process}</span>
										</div>
										<div className="flex justify-between border-b pb-2">
											<span className="font-medium">Price:</span>
											<span>${brew.fields.price}</span>
										</div>
										<div className="flex justify-between border-b pb-2">
											<span className="font-medium">Roaster:</span>
											<span>{brew.fields.roaster}</span>
										</div>
										{brew.fields.link && (
											<div className="pt-2">
												<a
													href={brew.fields.link}
													target="_blank"
													rel="noopener noreferrer"
													className="text-brown hover:underline"
												>
													View Product →
												</a>
											</div>
										)}
									</div>
								</section>
							</div>

							<div className="space-y-6">
								<section>
									<h2 className="text-2xl font-semibold mb-4 text-brown">Brew Parameters</h2>
									<div className="space-y-3">
										<div className="flex justify-between border-b pb-2">
											<span className="font-medium">Date:</span>
											<span>{brew.fields.brewDate}</span>
										</div>
										<div className="flex justify-between border-b pb-2">
											<span className="font-medium">Method:</span>
											<span>{brew.fields.brewMethod}</span>
										</div>
										<div className="flex justify-between border-b pb-2">
											<span className="font-medium">Grinder:</span>
											<span>{brew.fields.grinder}</span>
										</div>
										<div className="flex justify-between border-b pb-2">
											<span className="font-medium">Grind Setting:</span>
											<span>{brew.fields.grindSetting}</span>
										</div>
										<div className="flex justify-between border-b pb-2">
											<span className="font-medium">Water Temp:</span>
											<span>
												{brew.fields.waterTemp}
												{brew.fields.waterTemp ? "°F" : ""}
											</span>
										</div>
										<div className="flex justify-between border-b pb-2">
											<span className="font-medium">Coffee Dose:</span>
											<span>
												{brew.fields.coffeeDose}
												{brew.fields.coffeeDose ? "g" : ""}
											</span>
										</div>
										<div className="flex justify-between border-b pb-2">
											<span className="font-medium">Bloom Yield:</span>
											<span>
												{brew.fields.bloomYield}
												{brew.fields.bloomYield ? "g" : ""}
											</span>
										</div>
										<div className="flex justify-between border-b pb-2">
											<span className="font-medium">Coffee Yield:</span>
											<span>
												{brew.fields.coffeeYield}
												{brew.fields.coffeeYield ? `g (${gramsToFluidOunces(brew.fields.coffeeYield)} fl oz)` : ""}
											</span>
										</div>
										<div className="flex justify-between border-b pb-2">
											<span className="font-medium">Bloom Time:</span>
											<span>
												{brew.fields.bloomTime}
												{brew.fields.bloomTime ? " seconds" : ""}
											</span>
										</div>
										<div className="flex justify-between border-b pb-2">
											<span className="font-medium">Brew Time:</span>
											<span>{brew.fields.brewTime}</span>
										</div>
									</div>
								</section>
							</div>
						</div>

						<div className="space-y-6 mb-10">
							{brew.fields.tastingHighlights && (
								<section>
									<h2 className="text-2xl font-semibold mb-4 text-brown">Tasting Highlights</h2>
									<p className="text-gray-700 leading-relaxed">{brew.fields.tastingHighlights}</p>
								</section>
							)}

							{brew.fields.tastingNotes && (
								<section>
									<h2 className="text-2xl font-semibold mb-4 text-brown">Tasting Notes</h2>
									<p className="text-gray-700 leading-relaxed">{brew.fields.tastingNotes}</p>
								</section>
							)}

							{brew.fields.notes && (
								<section>
									<h2 className="text-2xl font-semibold mb-4 text-brown">Additional Notes</h2>
									<p className="text-gray-700 leading-relaxed">{brew.fields.notes}</p>
								</section>
							)}
						</div>

						<Link href="/coffee-brews">
							<Button variant="outline" className="mb-10">
								← Back to Coffee Brews
							</Button>
						</Link>
					</div>
				</div>
			</div>
			<Footer />
		</main>
	);
}
