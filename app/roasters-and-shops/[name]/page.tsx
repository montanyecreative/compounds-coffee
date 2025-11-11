import { notFound } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getRoasterByName, getRoasters, Roaster } from "@/lib/contentful";
import { getTranslations } from "@/lib/i18n";
import { ExternalLink } from "lucide-react";

interface RoasterDetailPageProps {
	params: {
		name: string;
	};
	searchParams?: { [key: string]: string | string[] | undefined };
}

export async function generateStaticParams() {
	const roasters = await getRoasters();
	return roasters.map((roaster) => ({ name: encodeURIComponent(roaster.fields.shopName) }));
}

export default async function RoasterDetailPage({ params, searchParams }: RoasterDetailPageProps) {
	const decodedName = decodeURIComponent(params.name);
	const langParam = typeof searchParams?.lang === "string" ? searchParams?.lang : undefined;
	const roaster = await getRoasterByName(decodedName, langParam);
	const translations = getTranslations(langParam);
	const roastersHref = langParam ? `/roasters?lang=${encodeURIComponent(langParam)}` : "/roasters";

	if (!roaster) {
		notFound();
	}

	// TypeScript type narrowing - ensure roaster is not null and properly typed
	const roasterTyped = roaster as Roaster;
	const roasterFields = roasterTyped.fields;

	// Extract website value to help TypeScript inference
	const website = roasterFields.shopWebsite as string;
	const websiteUrl = website.startsWith("http") ? website : `https://${website}`;

	// Extract location value to help TypeScript inference
	const locationData = roasterFields.shopLocation as { lat: number; lon: number } | undefined;
	const location = locationData ? `${locationData.lat.toFixed(4)}, ${locationData.lon.toFixed(4)}` : "N/A";

	return (
		<main>
			<Navbar />
			<div className="page-banner-filler bg-mediumRoast"></div>
			<div className="container-fluid">
				<div className="container sm:mx-auto md:mx-auto copy text-black">
					<div className="pt-10 md:pt-unset">
						<Link href={roastersHref}>
							<Button className="rounded-full px-10 mb-10 md:mb-10 text-mediumRoast border hover:bg-brown hover:border-brown hover:text-white cursor-pointer uppercase text-[12px]">
								← Back to Roasters
							</Button>
						</Link>

						<h1 className="text-4xl font-bold mb-8">{roasterFields.shopName}</h1>

						<div className="space-y-6 mb-10">
							<section>
								<h2 className="text-2xl font-semibold mb-4 text-brown">Roaster Details</h2>
								<div className="space-y-3">
									<div className="flex justify-between border-b pb-2">
										<span className="font-medium">Location:</span>
										<span>{location}</span>
									</div>
									<div className="flex justify-between border-b pb-2">
										<span className="font-medium">Website:</span>
										<Link
											href={websiteUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="text-brown hover:underline flex items-center gap-1"
										>
											{website}
											<ExternalLink className="h-4 w-4" />
										</Link>
									</div>
								</div>
							</section>
						</div>

						<Link href={roastersHref}>
							<Button className="rounded-full px-10 mb-10 md:mb-10 text-mediumRoast border hover:bg-brown hover:border-brown hover:text-white cursor-pointer uppercase text-[12px]">
								← Back to Roasters
							</Button>
						</Link>
					</div>
				</div>
			</div>
			<Footer />
		</main>
	);
}
