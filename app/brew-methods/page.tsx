import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { getBrewMethods } from "@/lib/contentful";
import BrewMethodsGrid from "@/components/brewMethodsGrid";
import { getTranslations } from "@/lib/i18n";

interface PageProps {
	searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function BrewMethodsPage({ searchParams }: PageProps) {
	const langParam = typeof searchParams?.lang === "string" ? searchParams?.lang : undefined;
	const brewMethods = await getBrewMethods(langParam);
	const visibleBrewMethods = brewMethods.filter((method) => !method.metadata?.tags?.some((tag) => tag.sys.id === "ninetailTest"));
	const translations = getTranslations(langParam);

	return (
		<main>
			<Navbar />
			<div className="page-banner-filler bg-mediumRoast"></div>
			<div className="container-fluid">
				<div className="container sm:mx-auto md:mx-auto copy text-black">
					<h1 className="text-3xl font-bold mb-6 pt-10 md:pt-unset">{translations("copy.brewMethodsPageTitle")}</h1>

					{visibleBrewMethods.length === 0 ? (
						<div className="text-center py-10">
							<p className="text-gray-600 mb-4">{translations("errors.noBrewMethodsFound")}</p>
						</div>
					) : (
						<BrewMethodsGrid brewMethods={visibleBrewMethods} />
					)}
				</div>
			</div>
			<Footer />
		</main>
	);
}
