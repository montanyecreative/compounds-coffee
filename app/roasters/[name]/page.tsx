import { notFound } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getRoasterByName, getRoasters } from "@/lib/contentful";
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
	return roasters.map((roaster) => ({ name: encodeURIComponent(roaster.fields.roasterName) }));
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

	const websiteUrl = roaster.fields.roasterWebsite.startsWith("http")
		? roaster.fields.roasterWebsite
		: `https://${roaster.fields.roasterWebsite}`;

	// Format location coordinates
	const location = roaster.fields.roasterLocation
		? `${roaster.fields.roasterLocation.lat.toFixed(4)}, ${roaster.fields.roasterLocation.lon.toFixed(4)}`
		: "N/A";

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

						<h1 className="text-4xl font-bold mb-8">{roaster.fields.roasterName}</h1>

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
											{roaster.fields.roasterWebsite}
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
