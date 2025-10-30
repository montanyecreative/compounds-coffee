import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getBrewMethods } from "@/lib/contentful";
import { gramsToFluidOunces } from "@/lib/utils";

export default async function BrewMethodsPage() {
	const brewMethods = await getBrewMethods();

	return (
		<main>
			<Navbar />
			<div className="page-banner-filler bg-mediumRoast"></div>
			<div className="container-fluid">
				<div className="container sm:mx-auto md:mx-auto copy text-black">
					<h1 className="text-3xl font-bold mb-6 pt-10 md:pt-unset">Brew Methods</h1>

					{brewMethods.length === 0 ? (
						<div className="text-center py-10">
							<p className="text-gray-600 mb-4">No brew methods found in Contentful.</p>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
							{brewMethods.map((brewMethod) => {
								const to = `/brew-methods/${encodeURIComponent(brewMethod.fields.brewMethod)}`;
								return (
									<Card key={brewMethod.sys.id} className="p-5 border hover:shadow-md transition-shadow">
										<div className="flex items-start justify-between mb-3">
											<h2 className="text-xl font-semibold">{brewMethod.fields.brewMethod}</h2>
											<Link href={to}>
												<Button size="sm" variant="outline">
													View
												</Button>
											</Link>
										</div>

										<div className="space-y-2 text-sm">
											{brewMethod.fields.brewTempRange && (
												<div className="flex justify-between border-b pb-2">
													<span className="font-medium">Temp Range</span>
													<span>
														{brewMethod.fields.brewTempRange}
														{brewMethod.fields.brewTempRange ? "°F" : ""}
													</span>
												</div>
											)}
											{brewMethod.fields.optimalCoffeeDose && (
												<div className="flex justify-between border-b pb-2">
													<span className="font-medium">Optimal Dose</span>
													<span>
														{brewMethod.fields.optimalCoffeeDose}
														{brewMethod.fields.optimalCoffeeDose ? "g" : ""}
													</span>
												</div>
											)}
											{brewMethod.fields.targetBloomYield && (
												<div className="flex justify-between border-b pb-2">
													<span className="font-medium">Bloom Yield</span>
													<span>
														{brewMethod.fields.targetBloomYield}
														{brewMethod.fields.targetBloomYield ? "g" : ""}
													</span>
												</div>
											)}
											{brewMethod.fields.targetBrewYield && (
												<div className="flex justify-between border-b pb-2">
													<span className="font-medium">Brew Yield</span>
													<span>
														{brewMethod.fields.targetBrewYield}
														{brewMethod.fields.targetBrewYield
															? `g (${gramsToFluidOunces(brewMethod.fields.targetBrewYield)} fl oz)`
															: ""}
													</span>
												</div>
											)}
											{brewMethod.fields.targetBloomTime && (
												<div className="flex justify-between border-b pb-2">
													<span className="font-medium">Bloom Time</span>
													<span>
														{brewMethod.fields.targetBloomTime}
														{brewMethod.fields.targetBloomYield ? " seconds" : ""}
													</span>
												</div>
											)}
											{brewMethod.fields.targetBrewTime && (
												<div className="flex justify-between border-b pb-2">
													<span className="font-medium">Brew Time</span>
													<span>{brewMethod.fields.targetBrewTime}</span>
												</div>
											)}
											{brewMethod.fields.textField1 && (
												<p className="text-gray-700 leading-relaxed pt-2">{brewMethod.fields.textField1}</p>
											)}
										</div>
									</Card>
								);
							})}
						</div>
					)}
				</div>
			</div>
			<Footer />
		</main>
	);
}
