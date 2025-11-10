import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { getRoasters } from "@/lib/contentful";
import RoastersGrid from "@/components/roastersGrid";
import { getTranslations } from "@/lib/i18n";

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
			<div className="banner-coffee-brews">
				<div className="container sm:mx-auto md:mx-auto flex banner-coffee-brews-copy items-center"></div>
			</div>
			<div className="container-fluid">
				<div className="container sm:mx-auto md:mx-auto copy text-black">
					<h1 className="text-3xl font-bold mb-6 pt-10 md:pt-unset">{translations("copy.roastersPageTitle")}</h1>

					{visibleRoasters.length === 0 ? (
						<div className="text-center py-10">
							<p className="text-gray-600 mb-4">{translations("errors.noRoastersFound")}</p>
						</div>
					) : (
						<RoastersGrid roasters={visibleRoasters} />
					)}
				</div>
			</div>
			<Footer />
		</main>
	);
}
