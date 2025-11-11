import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { getRoasters } from "@/lib/contentful";
import RoastersGrid from "@/components/roastersGrid";
import RoastersMap from "@/components/roastersMap";
import { getTranslations } from "@/lib/i18n";
import RoastersViewToggle from "@/components/roastersViewToggle";

interface PageProps {
	searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function RoastersPage({ searchParams }: PageProps) {
	const langParam = typeof searchParams?.lang === "string" ? searchParams?.lang : undefined;
	const roasters = await getRoasters(langParam);
	const visibleRoasters = roasters.filter((roaster) => !roaster.metadata?.tags?.some((tag) => tag.sys.id === "ninetailTest"));

	const translations = getTranslations(langParam);

	return (
		<main>
			<Navbar />
			<div className="page-banner-filler bg-mediumRoast"></div>
			<div className="container-fluid">
				<div className="container-fluid sm:mx-auto md:mx-4 copy text-black">
					<div className="flex items-center justify-between mb-6 pt-10 md:pt-unset">
						<h1 className="text-3xl font-bold">{translations("copy.roastersPageTitle")}</h1>
						<RoastersViewToggle />
					</div>

					{visibleRoasters.length === 0 ? (
						<div className="text-center py-10">
							<p className="text-gray-600 mb-4">{translations("errors.noRoastersFound")}</p>
						</div>
					) : (
						<>
							<div id="roasters-map-view">
								<RoastersMap roasters={visibleRoasters} />
							</div>

							<div id="roasters-grid-view" className="hidden">
								<RoastersGrid roasters={visibleRoasters} />
							</div>
						</>
					)}
				</div>
			</div>
			<Footer />
		</main>
	);
}
