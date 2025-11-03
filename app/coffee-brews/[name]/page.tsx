import { notFound } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCoffeeBrewByName, getCoffeeBrews } from "@/lib/contentful";
import { gramsToFluidOunces } from "@/lib/utils";
import { getTranslations } from "@/lib/i18n";

interface BrewDetailPageProps {
	params: {
		name: string;
	};
	searchParams?: { [key: string]: string | string[] | undefined };
}

export async function generateStaticParams() {
	const brews = await getCoffeeBrews();
	return brews.map((brew) => ({ name: encodeURIComponent(brew.fields.name) }));
}

export default async function BrewDetailPage({ params, searchParams }: BrewDetailPageProps) {
	const decodedName = decodeURIComponent(params.name);
	const langParam = typeof searchParams?.lang === "string" ? searchParams?.lang : undefined;
	const brew = await getCoffeeBrewByName(decodedName, langParam);
	const translations = getTranslations(langParam);
	const brewsHref = langParam ? `/coffee-brews?lang=${encodeURIComponent(langParam)}` : "/coffee-brews";

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
						<Link href={brewsHref}>
							<Button className="rounded-full px-10 mb-10 md:mb-10 text-mediumRoast border hover:bg-brown hover:border-brown hover:text-white cursor-pointer uppercase text-[12px]">
								{translations("coffeeBrews.back")}
							</Button>
						</Link>

						<h1 className="text-4xl font-bold mb-8">{brew.fields.name}</h1>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
							<div className="space-y-6">
								<section>
									<h2 className="text-2xl font-semibold mb-4 text-brown">{translations("coffeeBrews.coffeeDetails")}</h2>
									<div className="space-y-3">
										<div className="flex justify-between border-b pb-2">
											<span className="font-medium">{translations("labels.region")}:</span>
											<span>{brew.fields.region}</span>
										</div>
										<div className="flex justify-between border-b pb-2">
											<span className="font-medium">{translations("labels.roastLevel")}:</span>
											<span>{brew.fields.roastLevel}</span>
										</div>
										<div className="flex justify-between border-b pb-2">
											<span className="font-medium">{translations("labels.process")}:</span>
											<span>{brew.fields.process}</span>
										</div>
										<div className="flex justify-between border-b pb-2">
											<span className="font-medium">{translations("labels.price")}:</span>
											<span>${brew.fields.price}</span>
										</div>
										<div className="flex justify-between border-b pb-2">
											<span className="font-medium">{translations("labels.roaster")}:</span>
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
													{translations("coffeeBrews.viewProduct")}
												</a>
											</div>
										)}
									</div>
								</section>
							</div>

							<div className="space-y-6">
								<section>
									<h2 className="text-2xl font-semibold mb-4 text-brown">{translations("coffeeBrews.brewParameters")}</h2>
									<div className="space-y-3">
										<div className="flex justify-between border-b pb-2">
											<span className="font-medium">{translations("labels.date")}:</span>
											<span>{brew.fields.brewDate}</span>
										</div>
										<div className="flex justify-between border-b pb-2">
											<span className="font-medium">{translations("labels.method")}:</span>
											<span>{brew.fields.brewMethod}</span>
										</div>
										<div className="flex justify-between border-b pb-2">
											<span className="font-medium">{translations("labels.grinder")}:</span>
											<span>{brew.fields.grinder}</span>
										</div>
										<div className="flex justify-between border-b pb-2">
											<span className="font-medium">{translations("labels.grindSetting")}:</span>
											<span>{brew.fields.grindSetting}</span>
										</div>
										<div className="flex justify-between border-b pb-2">
											<span className="font-medium">{translations("labels.waterTemp")}:</span>
											<span>
												{brew.fields.waterTemp}
												{brew.fields.waterTemp ? "°F" : ""}
											</span>
										</div>
										<div className="flex justify-between border-b pb-2">
											<span className="font-medium">{translations("labels.coffeeDose")}:</span>
											<span>
												{brew.fields.coffeeDose}
												{brew.fields.coffeeDose ? "g" : ""}
											</span>
										</div>
										<div className="flex justify-between border-b pb-2">
											<span className="font-medium">{translations("labels.bloomYield")}:</span>
											<span>
												{brew.fields.bloomYield}
												{brew.fields.bloomYield ? "g" : ""}
											</span>
										</div>
										<div className="flex justify-between border-b pb-2">
											<span className="font-medium">{translations("labels.coffeeYield")}:</span>
											<span>
												{brew.fields.coffeeYield}
												{brew.fields.coffeeYield ? `${gramsToFluidOunces(brew.fields.coffeeYield)} fl oz` : ""}
											</span>
										</div>
										<div className="flex justify-between border-b pb-2">
											<span className="font-medium">{translations("labels.bloomTime")}:</span>
											<span>
												{brew.fields.bloomTime}
												{brew.fields.bloomTime ? " seconds" : ""}
											</span>
										</div>
										<div className="flex justify-between border-b pb-2">
											<span className="font-medium">{translations("labels.brewTime")}:</span>
											<span>{brew.fields.brewTime}</span>
										</div>
									</div>
								</section>
							</div>
						</div>

						<div className="space-y-6 mb-10">
							{brew.fields.tastingHighlights && (
								<section>
									<h2 className="text-2xl font-semibold mb-4 text-brown">
										{translations("coffeeBrews.tastingHighlights")}
									</h2>
									<p className="text-gray-700 leading-relaxed">{brew.fields.tastingHighlights}</p>
								</section>
							)}

							{brew.fields.tastingNotes && (
								<section>
									<h2 className="text-2xl font-semibold mb-4 text-brown">{translations("coffeeBrews.tastingNotes")}</h2>
									<p className="text-gray-700 leading-relaxed">{brew.fields.tastingNotes}</p>
								</section>
							)}

							{brew.fields.notes && (
								<section>
									<h2 className="text-2xl font-semibold mb-4 text-brown">
										{translations("coffeeBrews.additionalNotes")}
									</h2>
									<p className="text-gray-700 leading-relaxed">{brew.fields.notes}</p>
								</section>
							)}
						</div>

						<Link href={brewsHref}>
							<Button className="rounded-full px-10 mb-10 md:mb-10 text-mediumRoast border hover:bg-brown hover:border-brown hover:text-white cursor-pointer uppercase text-[12px]">
								{translations("coffeeBrews.back")}
							</Button>
						</Link>
					</div>
				</div>
			</div>
			<Footer />
		</main>
	);
}
