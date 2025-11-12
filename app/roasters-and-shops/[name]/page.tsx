import { notFound } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getRoasterByName, getRoasters, Roaster } from "@/lib/contentful";
import { getTranslations } from "@/lib/i18n";
import { ExternalLink } from "lucide-react";
import RoasterLocation from "@/components/location/geocodingClientSide";
import SingleRoasterMap from "@/components/location/singleRoasterMap";

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
	const roastersHref = langParam ? `/roasters-and-shops?lang=${encodeURIComponent(langParam)}` : "/roasters-and-shops";

	if (!roaster) {
		notFound();
	}

	// TypeScript type narrowing - ensure roaster is not null and properly typed
	const roasterTyped = roaster as Roaster;
	const roasterFields = roasterTyped.fields;

	// Extract website value to help TypeScript inference
	const website = roasterFields.shopWebsite as string;
	const websiteUrl = website.startsWith("http") ? website : `https://${website}`;

	// Extract phone number value to help TypeScript inference
	const phoneNumber = roasterFields.shopPhoneNumber as string | undefined;
	const phoneUrl = phoneNumber ? `tel:${phoneNumber.replace(/[\s\-\(\)]/g, "")}` : null;

	// Extract location value to help TypeScript inference
	const locationData = roasterFields.shopLocation as { lat: number; lon: number } | undefined;

	return (
		<main>
			<Navbar />
			<div className="page-banner-filler bg-mediumRoast"></div>
			<div className="container-fluid">
				<div className="container sm:mx-auto md:mx-auto copy text-black">
					<div className="pt-10 md:pt-unset">
						<Link href={roastersHref}>
							<Button className="rounded-full px-10 mb-10 md:mb-10 text-mediumRoast border hover:bg-brown hover:border-brown hover:text-white cursor-pointer uppercase text-[12px]">
								← Back to Roasters and Shops Locator
							</Button>
						</Link>

						<h1 className="text-4xl font-bold mb-8">{roasterFields.shopName}</h1>

						{/* Two-column layout */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
							{/* Left column: Details */}
							<div className="space-y-6">
								<section>
									<h2 className="text-2xl font-semibold mb-4 text-brown">Location Details</h2>
									<div className="space-y-3">
										<div className="flex flex-col md:flex-row md:justify-between border-b pb-2 gap-1 md:gap-0">
											<span className="font-medium">Address:</span>
											<RoasterLocation locationData={locationData} roasterId={roasterTyped.sys.id} />
										</div>
										<div className="flex flex-col md:flex-row md:justify-between border-b pb-2 gap-1 md:gap-0">
											<span className="font-medium">Phone Number:</span>
											{phoneNumber && phoneUrl ? (
												<a href={phoneUrl} className="text-brown hover:underline cursor-pointer">
													{phoneNumber}
												</a>
											) : (
												<span>{phoneNumber || "N/A"}</span>
											)}
										</div>
										<div className="flex flex-col md:flex-row md:justify-between border-b pb-2 gap-1 md:gap-0">
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

							{/* Right column: Map */}
							<div className="w-full h-full">
								<SingleRoasterMap locationData={locationData} shopName={roasterFields.shopName as string} />
							</div>
						</div>

						<Link href={roastersHref}>
							<Button className="rounded-full px-10 mb-10 md:mb-10 text-mediumRoast border hover:bg-brown hover:border-brown hover:text-white cursor-pointer uppercase text-[12px]">
								← Back to Roasters and Shops Locator
							</Button>
						</Link>
					</div>
				</div>
			</div>
			<Footer />
		</main>
	);
}
