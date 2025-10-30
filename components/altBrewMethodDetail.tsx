import { BrewMethod } from "@/lib/contentful";

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
							</span>
						)}
						{typeof brewMethod.fields.optimalCoffeeDose === "number" && (
							<span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold tracking-wide text-brown">
								{brewMethod.fields.optimalCoffeeDose}g dose
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
					<div className="rounded-xl border p-6">
						<div className="mb-4 flex items-center justify-between">
							<h2 className="text-xl font-semibold text-brown">Targets</h2>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
							{brewMethod.fields.targetBloomYield && (
								<div className="rounded-lg bg-white p-4 shadow-sm">
									<div className="text-gray-500">Bloom Yield</div>
									<div className="text-lg font-semibold">{brewMethod.fields.targetBloomYield}g</div>
								</div>
							)}
							{brewMethod.fields.targetBrewYield && (
								<div className="rounded-lg bg-white p-4 shadow-sm">
									<div className="text-gray-500">Brew Yield</div>
									<div className="text-lg font-semibold">{brewMethod.fields.targetBrewYield}g</div>
								</div>
							)}
							{typeof brewMethod.fields.optimalCoffeeDose === "number" && (
								<div className="rounded-lg bg-white p-4 shadow-sm">
									<div className="text-gray-500">Optimal Dose</div>
									<div className="text-lg font-semibold">{brewMethod.fields.optimalCoffeeDose}g</div>
								</div>
							)}
							{brewMethod.fields.brewTempRange && (
								<div className="rounded-lg bg-white p-4 shadow-sm">
									<div className="text-gray-500">Temp Range</div>
									<div className="text-lg font-semibold">{brewMethod.fields.brewTempRange}</div>
								</div>
							)}
						</div>
					</div>

					<div className="rounded-xl border p-6">
						<h2 className="text-xl font-semibold text-brown mb-4">Timing</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
							{brewMethod.fields.targetBloomTime && (
								<div className="rounded-lg bg-white p-4 shadow-sm">
									<div className="text-gray-500">Target Bloom Time</div>
									<div className="text-lg font-semibold">{brewMethod.fields.targetBloomTime}</div>
								</div>
							)}
							{brewMethod.fields.targetBrewTime && (
								<div className="rounded-lg bg-white p-4 shadow-sm">
									<div className="text-gray-500">Target Brew Time</div>
									<div className="text-lg font-semibold">{brewMethod.fields.targetBrewTime}</div>
								</div>
							)}
						</div>
					</div>

					{(brewMethod.fields.textField1 || brewMethod.fields.textField2) && (
						<div className="rounded-xl border p-6">
							<h2 className="text-xl font-semibold text-brown mb-4">Notes</h2>
							<div className="prose max-w-none text-gray-800">
								{brewMethod.fields.textField1 && <p>{brewMethod.fields.textField1}</p>}
								{brewMethod.fields.textField2 && <p>{brewMethod.fields.textField2}</p>}
							</div>
						</div>
					)}
				</div>

				{/* Right: Quick Specs / CTA */}
				<aside className="lg:col-span-1">
					<div className="sticky top-6 space-y-6">
						<div className="rounded-xl border p-6 bg-white">
							<h3 className="text-lg font-semibold text-brown mb-4">Quick Specs</h3>
							<dl className="space-y-3 text-sm">
								{brewMethod.fields.brewTempRange && (
									<div className="flex items-center justify-between">
										<dt className="text-gray-500">Temp Range</dt>
										<dd className="font-medium">{brewMethod.fields.brewTempRange}</dd>
									</div>
								)}
								{typeof brewMethod.fields.optimalCoffeeDose === "number" && (
									<div className="flex items-center justify-between">
										<dt className="text-gray-500">Optimal Dose</dt>
										<dd className="font-medium">{brewMethod.fields.optimalCoffeeDose}g</dd>
									</div>
								)}
								{brewMethod.fields.targetBloomYield && (
									<div className="flex items-center justify-between">
										<dt className="text-gray-500">Bloom Yield</dt>
										<dd className="font-medium">{brewMethod.fields.targetBloomYield}g</dd>
									</div>
								)}
								{brewMethod.fields.targetBrewYield && (
									<div className="flex items-center justify-between">
										<dt className="text-gray-500">Brew Yield</dt>
										<dd className="font-medium">{brewMethod.fields.targetBrewYield}g</dd>
									</div>
								)}
								{brewMethod.fields.targetBloomTime && (
									<div className="flex items-center justify-between">
										<dt className="text-gray-500">Bloom Time</dt>
										<dd className="font-medium">{brewMethod.fields.targetBloomTime}</dd>
									</div>
								)}
								{brewMethod.fields.targetBrewTime && (
									<div className="flex items-center justify-between">
										<dt className="text-gray-500">Brew Time</dt>
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
