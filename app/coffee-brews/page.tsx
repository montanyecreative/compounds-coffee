import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCoffeeBrews } from "@/lib/contentful";
import BrewsFilters from "@/components/brewLog/brewsFilters";
import { getTranslations } from "@/lib/i18n";
import Image from "next/image";

interface CoffeeBrewsPageProps {
	searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function CoffeeBrews({ searchParams }: CoffeeBrewsPageProps) {
	const langParam = typeof searchParams?.lang === "string" ? searchParams?.lang : undefined;
	const brews = await getCoffeeBrews(langParam);
	const translations = getTranslations(langParam);
	const addBrewHref = langParam ? `/add-a-brew?lang=${encodeURIComponent(langParam)}` : "/add-a-brew";

	return (
		<main>
			<Navbar />
			<div className="relative banner-coffee-brews h-[600px]">
				<Image src="/banner-coffee-brews.webp" alt="" fill priority className="object-cover object-center" sizes="100vw" />
				<div className="container sm:mx-auto md:mx-auto flex banner-coffee-brews-copy items-center relative z-10 h-full"></div>
			</div>
			<div className="container-fluid">
				<div className="container sm:mx-auto md:mx-auto copy text-black">
					<h2 className="mb-5 pt-10 md:pt-unset text-black">{translations("copy.coffeeBrewsPageTitle")}</h2>

					{brews.length === 0 ? (
						<div className="text-center py-10">
							<p className="text-gray-600 mb-4">{translations("errors.noCoffeeBrewsFound")}</p>
							<Link href={addBrewHref}>
								<Button>{translations("coffeeBrews.addFirstBrew")}</Button>
							</Link>
						</div>
					) : (
						<BrewsFilters brews={brews} />
					)}
				</div>
			</div>
			<Footer />
		</main>
	);
}
