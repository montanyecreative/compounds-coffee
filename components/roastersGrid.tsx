"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Roaster } from "@/lib/contentful";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface RoastersGridProps {
	roasters: Roaster[];
}

export default function RoastersGrid({ roasters }: RoastersGridProps) {
	const searchParams = useSearchParams();
	const currentLang = searchParams.get("lang");

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
			{roasters.map((roaster) => {
				const websiteUrl = roaster.fields.roasterWebsite.startsWith("http")
					? roaster.fields.roasterWebsite
					: `https://${roaster.fields.roasterWebsite}`;

				// Format location coordinates
				const location = roaster.fields.roasterLocation
					? `${roaster.fields.roasterLocation.lat.toFixed(4)}, ${roaster.fields.roasterLocation.lon.toFixed(4)}`
					: "N/A";

				const roasterDetailUrl = currentLang
					? `/roasters/${encodeURIComponent(roaster.fields.roasterName)}?lang=${encodeURIComponent(currentLang)}`
					: `/roasters/${encodeURIComponent(roaster.fields.roasterName)}`;

				return (
					<Card key={roaster.sys.id} className="p-5 border rounded hover:shadow-lg transition-shadow">
						<CardHeader className="p-0 pb-4">
							<Link href={roasterDetailUrl} className="hover:underline">
								<CardTitle className="text-xl font-semibold text-brown hover:text-brown/80">
									{roaster.fields.roasterName}
								</CardTitle>
							</Link>
						</CardHeader>
						<CardContent className="p-0 space-y-3">
							<div className="flex items-start gap-2">
								<span className="font-medium text-sm text-gray-700 min-w-[80px]">Location:</span>
								<span className="text-sm text-gray-600">{location}</span>
							</div>
							<div className="flex items-start gap-2">
								<span className="font-medium text-sm text-gray-700 min-w-[80px]">Website:</span>
								<Link
									href={websiteUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
									onClick={(e) => e.stopPropagation()}
								>
									{roaster.fields.roasterWebsite}
									<ExternalLink className="h-3 w-3" />
								</Link>
							</div>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
