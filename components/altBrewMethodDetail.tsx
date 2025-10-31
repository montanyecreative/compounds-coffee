import { BrewMethod } from "@/lib/contentful";
import { gramsToFluidOunces } from "@/lib/utils";

interface AltBrewMethodDetailProps {
	brewMethod: BrewMethod;
}

export default function AltBrewMethodDetail({ brewMethod }: AltBrewMethodDetailProps) {
	return (
		<section className="pb-16">
			{/* Hero header */}
			<div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-lightRoast to-white p-8 text-black mb-10">
				<div className="relative z-10">
					<div className="mb-3 inline-flex items-center gap-2">
						<span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold tracking-wide text-brown">
							Brew Method
						</span>
						{brewMethod.fields.brewTempRange && (
							<span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold tracking-wide text-brown">
								{brewMethod.fields.brewTempRange}
								{brewMethod.fields.brewTempRange ? "°F temperature range" : ""}
							</span>
						)}
						{typeof brewMethod.fields.optimalCoffeeDose === "number" && (
							<span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold tracking-wide text-brown">
								{brewMethod.fields.optimalCoffeeDose}
								{brewMethod.fields.optimalCoffeeDose ? "g coffee needed" : ""}
							</span>
						)}
						{typeof brewMethod.fields.targetBrewYield === "number" && (
							<span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold tracking-wide text-brown">
								{brewMethod.fields.targetBrewYield}g
								{brewMethod.fields.targetBrewYield
									? ` (${gramsToFluidOunces(brewMethod.fields.targetBrewYield)} fl oz) coffee made`
									: ""}
							</span>
						)}
					</div>
					<h1 className="text-4xl md:text-5xl font-extrabold leading-tight">{brewMethod.fields.brewMethod}</h1>
					{(brewMethod.fields.textField1 || brewMethod.fields.textField2) && (
						<p className="mt-3 max-w-2xl text-gray-700">{brewMethod.fields.textField1 || brewMethod.fields.textField2}</p>
					)}
				</div>
				<div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/40 blur-2xl" />
				<div className="pointer-events-none absolute -left-12 bottom-0 h-20 w-20 rounded-full bg-brown/10 blur-xl" />
			</div>

			{/* Content layout */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Left: Steps and timing */}
				<div className="lg:col-span-2 space-y-8">
					{brewMethod.fields.textField1 && (
						<div>
							<div className="rounded-xl border p-6">
								<h2 className="text-xl font-semibold text-brown mb-4">Notes</h2>
								<div className="prose max-w-none text-gray-800">
									<p className="text-gray-700 leading-relaxed">{brewMethod.fields.textField1}</p>
									{brewMethod.fields.textField2 && (
										<div>
											<br />
											<p className="text-gray-700 leading-relaxed">{brewMethod.fields.textField2}</p>
										</div>
									)}{" "}
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Right: Quick Specs / CTA */}
				<aside className="lg:col-span-1">
					<div className="sticky top-6 space-y-6">
						<div className="rounded-xl border p-6 bg-white">
							<h3 className="text-lg font-semibold text-brown mb-4">Specifications</h3>
							<dl className="space-y-3 text-sm">
								{brewMethod.fields.brewTempRange && (
									<div className="flex items-center justify-between">
										<dt className="text-gray-500">Temp Range</dt>
										<dd className="font-medium">
											{brewMethod.fields.brewTempRange}
											{brewMethod.fields.brewTempRange ? "°F" : ""}
										</dd>
									</div>
								)}
								{typeof brewMethod.fields.optimalCoffeeDose === "number" && (
									<div className="flex items-center justify-between">
										<dt className="text-gray-500">Optimal Dose</dt>
										<dd className="font-medium">
											{brewMethod.fields.optimalCoffeeDose}
											{brewMethod.fields.optimalCoffeeDose ? "g" : ""}
										</dd>
									</div>
								)}
								{brewMethod.fields.targetBloomYield && (
									<div className="flex items-center justify-between">
										<dt className="text-gray-500">Target Bloom Yield</dt>
										<dd className="font-medium">
											{brewMethod.fields.targetBloomYield}
											{brewMethod.fields.targetBloomYield ? "g" : ""}
										</dd>
									</div>
								)}
								{brewMethod.fields.targetBrewYield && (
									<div className="flex items-center justify-between">
										<dt className="text-gray-500">Target Brew Yield</dt>
										<dd className="font-medium">
											{brewMethod.fields.targetBrewYield}
											{brewMethod.fields.targetBrewYield ? `g` : ""}
											{brewMethod.fields.targetBrewYield
												? ` (${gramsToFluidOunces(brewMethod.fields.targetBrewYield)} fl oz)`
												: ""}
										</dd>
									</div>
								)}
								{brewMethod.fields.targetBloomTime && (
									<div className="flex items-center justify-between">
										<dt className="text-gray-500">Target Bloom Time</dt>
										<dd className="font-medium">
											{brewMethod.fields.targetBloomTime}
											{brewMethod.fields.targetBloomTime ? " seconds" : ""}
										</dd>
									</div>
								)}
								{brewMethod.fields.targetBrewTime && (
									<div className="flex items-center justify-between">
										<dt className="text-gray-500">Target Brew Time</dt>
										<dd className="font-medium">{brewMethod.fields.targetBrewTime}</dd>
									</div>
								)}
							</dl>
						</div>

						{brewMethod.fields.linkToProduct && (
							<a
								href={brewMethod.fields.linkToProduct}
								target="_blank"
								rel="noopener noreferrer"
								className="block rounded-xl bg-brown px-6 py-4 text-center font-semibold text-white hover:bg-brown/90 transition"
							>
								Recommended Product →
							</a>
						)}
					</div>
				</aside>
			</div>
		</section>
	);
}
