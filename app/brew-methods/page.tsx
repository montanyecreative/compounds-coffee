import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getBrewMethods } from "@/lib/contentful";
import { gramsToFluidOunces } from "@/lib/utils";
import BrewMethodsGrid from "@/components/brewMethodsGrid";

interface PageProps {
	searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function BrewMethodsPage({ searchParams }: PageProps) {
	const langParam = typeof searchParams?.lang === "string" ? searchParams?.lang : undefined;
	const brewMethods = await getBrewMethods(langParam);
	const visibleBrewMethods = brewMethods.filter((method) => !method.metadata?.tags?.some((tag) => tag.sys.id === "ninetailTest"));

	return (
		<main>
			<Navbar />
			<div className="page-banner-filler bg-mediumRoast"></div>
			<div className="container-fluid">
				<div className="container sm:mx-auto md:mx-auto copy text-black">
					<h1 className="text-3xl font-bold mb-6 pt-10 md:pt-unset">Brew Methods</h1>

					{visibleBrewMethods.length === 0 ? (
						<div className="text-center py-10">
							<p className="text-gray-600 mb-4">No brew methods found in Contentful.</p>
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
