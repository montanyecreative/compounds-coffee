import { notFound } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getBrewMethodBySlug, getBrewMethods } from "@/lib/contentful";

interface BrewMethodPageProps {
	params: { slug: string };
}

export async function generateStaticParams() {
	const brewMethods = await getBrewMethods();
	return brewMethods.map((brewMethod) => ({ slug: brewMethod.fields.slug || brewMethod.sys.id }));
}

export default async function BrewMethodPage({ params }: BrewMethodPageProps) {
	const { slug } = await params;
	const brewMethod = await getBrewMethodBySlug(slug);

	if (!brewMethod) {
		notFound();
	}

	return (
		<main>
			<Navbar />
			<div className="page-banner-filler bg-mediumRoast"></div>
			<div className="container-fluid">
				<div className="container sm:mx-auto md:mx-auto copy text-black">
					<div className="pt-10 md:pt-unset">
						<Link href="/brew-methods">
							<Button className="rounded-full px-10 mb-10 md:mb-10 text-mediumRoast border hover:bg-brown hover:border-brown hover:text-white cursor-pointer uppercase text-[12px]">
								← Back to Brew Methods
							</Button>
						</Link>

						<h1 className="text-4xl font-bold mb-2">{brewMethod.fields.brewMethod}</h1>
						<p className="text-gray-600 mb-8">Brew Method Recipe</p>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
							<section>
								<h2 className="text-2xl font-semibold mb-4 text-brown">Targets</h2>
								<div className="space-y-3">
									{brewMethod.fields.brewTempRange && (
										<div className="flex justify-between border-b pb-2">
											<span className="font-medium">Temp Range:</span>
											<span>{brewMethod.fields.brewTempRange}</span>
										</div>
									)}
									{brewMethod.fields.optimalCoffeeDose && (
										<div className="flex justify-between border-b pb-2">
											<span className="font-medium">Optimal Dose:</span>
											<span>{brewMethod.fields.optimalCoffeeDose}</span>
										</div>
									)}
									{brewMethod.fields.targetBloomYield && (
										<div className="flex justify-between border-b pb-2">
											<span className="font-medium">Target Bloom Yield:</span>
											<span>{brewMethod.fields.targetBloomYield}</span>
										</div>
									)}
									{brewMethod.fields.targetBrewYield && (
										<div className="flex justify-between border-b pb-2">
											<span className="font-medium">Target Brew Yield:</span>
											<span>{brewMethod.fields.targetBrewYield}</span>
										</div>
									)}
								</div>
							</section>

							<section>
								<h2 className="text-2xl font-semibold mb-4 text-brown">Timing</h2>
								<div className="space-y-3">
									{brewMethod.fields.targetBloomTime && (
										<div className="flex justify-between border-b pb-2">
											<span className="font-medium">Target Bloom Time:</span>
											<span>{brewMethod.fields.targetBloomTime}</span>
										</div>
									)}
									{brewMethod.fields.targetBrewTime && (
										<div className="flex justify-between border-b pb-2">
											<span className="font-medium">Target Brew Time:</span>
											<span>{brewMethod.fields.targetBrewTime}</span>
										</div>
									)}
								</div>
							</section>
						</div>

						<div className="space-y-6 mb-10">
							{brewMethod.fields.textField1 && (
								<section>
									<h2 className="text-2xl font-semibold mb-4 text-brown">Notes</h2>
									<p className="text-gray-700 leading-relaxed">{brewMethod.fields.textField1}</p>
								</section>
							)}
							{brewMethod.fields.textField2 && (
								<section>
									<h2 className="text-2xl font-semibold mb-4 text-brown">More Tips</h2>
									<p className="text-gray-700 leading-relaxed">{brewMethod.fields.textField2}</p>
								</section>
							)}

							{brewMethod.fields.linkToProduct && (
								<div>
									<a
										href={brewMethod.fields.linkToProduct}
										target="_blank"
										rel="noopener noreferrer"
										className="text-brown hover:underline"
									>
										Recommended Product →
									</a>
								</div>
							)}
						</div>

						<Link href="/brew-methods">
							<Button className="rounded-full px-10 mb-10 md:mb-10 text-mediumRoast border hover:bg-brown hover:border-brown hover:text-white cursor-pointer uppercase text-[12px]">
								← Back to Brew Methods
							</Button>
						</Link>
					</div>
				</div>
			</div>
			<Footer />
		</main>
	);
}
