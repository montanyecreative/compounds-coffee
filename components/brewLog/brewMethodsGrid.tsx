"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BrewMethod } from "@/lib/contentful";
import { gramsToFluidOunces } from "@/lib/utils";
import { useTranslations } from "@/lib/useTranslations";

interface BrewMethodsGridProps {
	brewMethods: BrewMethod[];
	defaultLocaleMethods?: BrewMethod[] | null;
}

export default function BrewMethodsGrid({ brewMethods, defaultLocaleMethods }: BrewMethodsGridProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const currentLang = searchParams.get("lang");
	const { translations } = useTranslations();

	// Create a map of entry IDs to default locale names for consistent URL generation
	const defaultNameMap = new Map<string, string>();
	if (defaultLocaleMethods) {
		defaultLocaleMethods.forEach((method) => {
			defaultNameMap.set(method.sys.id, method.fields.brewMethod);
		});
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
			{brewMethods.map((brewMethod) => {
				// Use default locale name for URL if available, otherwise fallback to current locale name
				const urlName = defaultNameMap.get(brewMethod.sys.id) || brewMethod.fields.brewMethod;
				const base = `/brew-methods/${encodeURIComponent(urlName)}`;
				const to = currentLang ? `${base}?lang=${encodeURIComponent(currentLang)}` : base;
				return (
					<Card key={brewMethod.sys.id} className="p-5 border rounded">
						<div className="flex items-start justify-between mb-3">
							<h2 className="text-xl font-semibold">{brewMethod.fields.brewMethod}</h2>
							<Button
								size="sm"
								variant="outline"
								className="bg-white text-black border-black rounded hover:bg-black hover:text-white hover:cursor-pointer"
								onClick={() => {
									// 50% chance to show alt view using a simple math check
									const showAlt = Math.random() < 0.5;
									if (showAlt) {
										const hasQuery = to.includes("?");
										router.push(`${to}${hasQuery ? "&" : "?"}alt=1`);
									} else {
										router.push(to);
									}
								}}
							>
								{translations("labels.view")}
							</Button>
						</div>

						<div className="space-y-2 text-sm">
							{brewMethod.fields.brewTempRange && (
								<div className="flex justify-between border-b pb-2">
									<span className="font-medium">{translations("labels.tempRange")}</span>
									<span>
										{brewMethod.fields.brewTempRange}
										{brewMethod.fields.brewTempRange ? "°F" : ""}
									</span>
								</div>
							)}
							{brewMethod.fields.optimalCoffeeDose && (
								<div className="flex justify-between border-b pb-2">
									<span className="font-medium">{translations("labels.optimalDose")}</span>
									<span>
										{brewMethod.fields.optimalCoffeeDose}
										{brewMethod.fields.optimalCoffeeDose ? "g" : ""}
									</span>
								</div>
							)}
							{brewMethod.fields.targetBloomYield && (
								<div className="flex justify-between border-b pb-2">
									<span className="font-medium">{translations("labels.bloomYield")}</span>
									<span>
										{brewMethod.fields.targetBloomYield}
										{brewMethod.fields.targetBloomYield ? "g" : ""}
									</span>
								</div>
							)}
							{brewMethod.fields.targetBrewYield && (
								<div className="flex justify-between border-b pb-2">
									<span className="font-medium">{translations("labels.brewYield")}</span>
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
									<span className="font-medium">{translations("labels.bloomTime")}</span>
									<span>
										{brewMethod.fields.targetBloomTime}
										{brewMethod.fields.targetBloomYield ? " seconds" : ""}
									</span>
								</div>
							)}
							{brewMethod.fields.targetBrewTime && (
								<div className="flex justify-between border-b pb-2">
									<span className="font-medium">{translations("labels.brewTime")}</span>
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
	);
}
