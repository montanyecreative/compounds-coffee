import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { getBrewMethods } from "@/lib/contentful";
import BrewMethodsGrid from "@/components/brewLog/brewMethodsGrid";
import { getTranslations } from "@/lib/i18n";
import Image from "next/image";

interface PageProps {
	searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function BrewMethodsPage({ searchParams }: PageProps) {
	const langParam = typeof searchParams?.lang === "string" ? searchParams?.lang : undefined;
	const brewMethods = await getBrewMethods(langParam);
	const visibleBrewMethods = brewMethods.filter((method) => !method.metadata?.tags?.some((tag) => tag.sys.id === "ninetailTest"));

	// Also fetch default locale versions for consistent URL generation
	const defaultLocaleMethods = langParam && langParam !== "en-US" ? await getBrewMethods("en-US") : null;

	const translations = getTranslations(langParam);

	return (
		<main>
			<Navbar />
			<div className="relative banner-brew-methods h-[600px]">
				<Image
					src="/banner-brew-methods.webp"
					alt={translations("alt.brewMethodsBanner")}
					fill
					priority
					className="object-cover object-top"
					sizes="100vw"
				/>
				<div className="container sm:mx-auto md:mx-auto flex banner-brew-methods-copy items-center relative z-10 h-full"></div>
			</div>
			<div className="container-fluid">
				<div className="container sm:mx-auto md:mx-auto copy text-black">
					<h1 className="text-3xl font-bold mb-6 pt-10 md:pt-unset">{translations("copy.brewMethodsPageTitle")}</h1>

					{visibleBrewMethods.length === 0 ? (
						<div className="text-center py-10">
							<p className="text-gray-600 mb-4">{translations("errors.noBrewMethodsFound")}</p>
						</div>
					) : (
						<BrewMethodsGrid brewMethods={visibleBrewMethods} defaultLocaleMethods={defaultLocaleMethods} />
					)}
				</div>
			</div>
			<Footer />
		</main>
	);
}
