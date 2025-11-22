import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { getRoasters, getRoastersTest } from "@/lib/contentful";
import { getTranslations } from "@/lib/i18n";
import RoastersViewToggle from "@/components/location/roastersViewToggle";
import RoastersPageContent from "@/components/location/roastersPageContent";
import RoastersDataToggle from "@/components/location/roastersDataToggle";

interface PageProps {
	searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function RoastersPage({ searchParams }: PageProps) {
	const langParam = typeof searchParams?.lang === "string" ? searchParams?.lang : undefined;
	const useTestData = searchParams?.test === "true";

	// Fetch from appropriate content model
	const roasters = useTestData ? await getRoastersTest(langParam) : await getRoasters(langParam);
	const visibleRoasters = roasters.filter((roaster) => !roaster.metadata?.tags?.some((tag) => tag.sys.id === "ninetailTest"));

	const translations = getTranslations(langParam);

	return (
		<main>
			<Navbar />
			<div className="page-banner-filler bg-mediumRoast"></div>
			<div className="container-fluid">
				<div className="container-fluid mx-4 copy text-black">
					<div className="flex items-center justify-between mb-6 pt-10 md:pt-unset">
						<h1 className="text-3xl font-bold">{translations("copy.roastersPageTitle")}</h1>
						<div className="flex items-center gap-3">
							<RoastersDataToggle />
							<RoastersViewToggle />
						</div>
					</div>

					{visibleRoasters.length === 0 ? (
						<div className="text-center py-10">
							<p className="text-gray-600 mb-4">{translations("errors.noRoastersFound")}</p>
						</div>
					) : (
						<RoastersPageContent roasters={visibleRoasters} />
					)}
				</div>
			</div>
			<Footer />
		</main>
	);
}
